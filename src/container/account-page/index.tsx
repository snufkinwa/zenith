'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';
import { type User } from '@supabase/supabase-js';
import Avatar from '@components/profile/avatar';

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [education, setEducation] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [github, setGithub] = useState<string | null>(null);
  const [linkedin, setLinkedin] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState<string | null>(null);
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<{
    easy: number;
    medium: number;
    hard: number;
  }>({ easy: 0, medium: 0, hard: 0 });
  const [studyGoal, setStudyGoal] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user?.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setFullName(data.full_name);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setBio(data.bio);
        setLocation(data.location);
        setEducation(data.education);
        setWebsite(data.website);
        setGithub(data.github);
        setLinkedin(data.linkedin);
        setSkills(data.skills || []);
        setTargetRole(data.target_role);
        setPreferredLanguages(data.preferred_languages || []);
        setSolvedProblems(
          data.solved_problems || { easy: 0, medium: 0, hard: 0 },
        );
        setStudyGoal(data.study_goal);
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile() {
    try {
      setLoading(true);
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
        bio,
        location,
        education,
        website,
        github,
        linkedin,
        skills,
        target_role: targetRole,
        preferred_languages: preferredLanguages,
        solved_problems: solvedProblems,
        study_goal: studyGoal,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <Avatar
        uid={user?.id ?? null}
        url={avatarUrl}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile();
        }}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName || ''}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={bio || ''}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input
          id="location"
          type="text"
          value={location || ''}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="education">Education</label>
        <input
          id="education"
          type="text"
          value={education || ''}
          onChange={(e) => setEducation(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="github">GitHub</label>
        <input
          id="github"
          type="url"
          value={github || ''}
          onChange={(e) => setGithub(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="linkedin">LinkedIn</label>
        <input
          id="linkedin"
          type="url"
          value={linkedin || ''}
          onChange={(e) => setLinkedin(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="skills">Skills (comma-separated)</label>
        <input
          id="skills"
          type="text"
          value={skills.join(', ')}
          onChange={(e) =>
            setSkills(e.target.value.split(',').map((skill) => skill.trim()))
          }
        />
      </div>
      <div>
        <label htmlFor="targetRole">Target Role</label>
        <input
          id="targetRole"
          type="text"
          value={targetRole || ''}
          onChange={(e) => setTargetRole(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="preferredLanguages">
          Preferred Programming Languages (comma-separated)
        </label>
        <input
          id="preferredLanguages"
          type="text"
          value={preferredLanguages.join(', ')}
          onChange={(e) =>
            setPreferredLanguages(
              e.target.value.split(',').map((lang) => lang.trim()),
            )
          }
        />
      </div>
      <div>
        <label>Solved Problems</label>
        <div>
          <label htmlFor="easyProblems">Easy</label>
          <input
            id="easyProblems"
            type="number"
            value={solvedProblems.easy}
            onChange={(e) =>
              setSolvedProblems({
                ...solvedProblems,
                easy: Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label htmlFor="mediumProblems">Medium</label>
          <input
            id="mediumProblems"
            type="number"
            value={solvedProblems.medium}
            onChange={(e) =>
              setSolvedProblems({
                ...solvedProblems,
                medium: Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label htmlFor="hardProblems">Hard</label>
          <input
            id="hardProblems"
            type="number"
            value={solvedProblems.hard}
            onChange={(e) =>
              setSolvedProblems({
                ...solvedProblems,
                hard: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
      <div>
        <label htmlFor="studyGoal">Study Goal (e.g., problems per week)</label>
        <input
          id="studyGoal"
          type="text"
          value={studyGoal || ''}
          onChange={(e) => setStudyGoal(e.target.value)}
        />
      </div>
      <div>
        <button
          className="button primary block"
          onClick={updateProfile}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>
      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
