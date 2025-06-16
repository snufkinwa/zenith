import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import ActivityHeatmap from './ActivityHeatMap';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from '../../utils/supabase/supabaseClient'; // Adjust the import path as needed

interface UserProfile {
  username: string;
  full_name: string;
  avatar_url: string;
  rank: number;
  bio: string;
  location: string;
  education: string;
  website: string;
  github: string;
  linkedin: string;
  skills: string[];
  contest_rating: number;
  global_ranking: number;
  total_participants: number;
  solved_problems: {
    easy: number,
    medium: number,
    hard: number
  }
}

const Dashboard: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchUserProfile();
}, [fetchUserProfile]); 

  if (loading) return <div>Loading...</div>;
  if (!userProfile) return <div>No user data found.</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.profileSection}>
        <img src={userProfile.avatar_url} alt="Profile" className={styles.avatar} />
        <div className={styles.profileInfo}>
          <h1>{userProfile.full_name}</h1>
          <p>{userProfile.username}</p>
          <p>Rank {userProfile.rank}</p>
          <p>{userProfile.bio}</p>
          <button className={styles.editProfile}>Edit Profile</button>
        </div>
        <div className={styles.locationInfo}>
          <p>🌍 {userProfile.location}</p>
          <p>🎓 {userProfile.education}</p>
          <p>🌐 {userProfile.website}</p>
          <p>👤 {userProfile.github}</p>
          <p>💼 {userProfile.linkedin}</p>
        </div>
        <div className={styles.skills}>
          {userProfile.skills.map((skill, index) => (
            <span key={index}>{skill}</span>
          ))}
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.contestRating}>
          <h2>Contest Rating</h2>
          <h3>{userProfile.contest_rating}</h3>
          <p>Global Ranking {userProfile.global_ranking}/{userProfile.total_participants}</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[{ date: 'Mar 2023', rating: userProfile.contest_rating }]}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rating" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.solvedProblems}>
          <h2>Solved Problems</h2>
          <div className={styles.problemsChart}>
            <div className={styles.problemBar}>
              <span>Easy</span>
              <div style={{width: `${(userProfile.solved_problems.easy / 718) * 100}%`}}></div>
              <span>{userProfile.solved_problems.easy}/718</span>
            </div>
            <div className={styles.problemBar}>
              <span>Medium</span>
              <div style={{width: `${(userProfile.solved_problems.medium / 1515) * 100}%`}}></div>
              <span>{userProfile.solved_problems.medium}/1515</span>
            </div>
            <div className={styles.problemBar}>
              <span>Hard</span>
              <div style={{width: `${(userProfile.solved_problems.hard / 629) * 100}%`}}></div>
              <span>{userProfile.solved_problems.hard}/629</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.activitySection}>
        <h2>Submissions in the last year</h2>
        <ActivityHeatmap />
      </div>
    </div>
  );
};

export default Dashboard;