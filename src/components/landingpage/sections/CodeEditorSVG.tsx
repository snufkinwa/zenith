export default function CodeEditorSVG() {
  return (
    <>
      {/* Code Editor SVG */}
      <svg
        viewBox="0 0 1400 800"
        className="h-auto min-h-[600px] w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="sidebarGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#1e2a3a" />
            <stop offset="100%" stopColor="#0f1419" />
          </linearGradient>
          <linearGradient
            id="problemGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f8f9fa" />
            <stop offset="100%" stopColor="#e9ecef" />
          </linearGradient>
          <linearGradient id="codeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1e23" />
            <stop offset="100%" stopColor="#0d1117" />
          </linearGradient>
        </defs>

        {/* Main Background */}
        <rect width="1400" height="800" fill="#0d1117" rx="12" />

        {/* Left Sidebar */}
        <rect width="200" height="800" fill="url(#sidebarGradient)" />

        {/* Sidebar Navigation */}

        {/* ZENITH Logo */}
        <g transform="translate(10, 10)">
          <defs>
            <clipPath id="logoClip1">
              <path
                d="M 24.140625 105 L 280 105 L 280 293 L 24.140625 293 Z M 24.140625 105 "
                clipRule="nonzero"
              />
            </clipPath>
            <clipPath id="logoClip2">
              <path
                d="M 24.140625 221 L 338 221 L 338 375 L 24.140625 375 Z M 24.140625 221 "
                clipRule="nonzero"
              />
            </clipPath>
            <linearGradient
              id="zenithLogoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#124dff" stopOpacity="1" />
              <stop offset="1" stopColor="#33cc99" stopOpacity="1" />
            </linearGradient>
          </defs>
          <g transform="scale(0.10)">
            <path
              fill="none"
              strokeWidth="5"
              stroke="url(#zenithLogoGradient)"
              d="M 35.179688 89.871094 L 188.144531 0.0546875 L 348.277344 93.777344 L 348.921875 151.695312 L 185.5625 57.328125 L 83.347656 118.507812 Z M 35.179688 89.871094 "
              fillOpacity="1"
              fillRule="evenodd"
            />
            <g clipPath="url(#logoClip1)">
              <path
                fill="none"
                strokeWidth="5"
                stroke="url(#zenithLogoGradient)"
                d="M 24.140625 105.496094 L 24.785156 200.511719 L 186.855469 292.941406 L 279.285156 240.867188 L 279.285156 215.492188 L 250.648438 201.15625 L 186.210938 236.3125 L 75.535156 173.164062 L 75.535156 137.394531 Z M 24.140625 105.496094 "
                fillOpacity="1"
                fillRule="evenodd"
              />
            </g>
            <g clipPath="url(#logoClip2)">
              <path
                fill="none"
                strokeWidth="5"
                stroke="url(#zenithLogoGradient)"
                d="M 291.652344 259.109375 L 337.847656 288.390625 L 186.210938 374.945312 L 24.785156 280.578125 L 26.078125 221.980469 L 187.5 317.027344 Z M 291.652344 259.109375 "
                fillOpacity="1"
                fillRule="evenodd"
              />
            </g>
            <path
              fill="none"
              strokeWidth="5"
              stroke="url(#zenithLogoGradient)"
              d="M 97.039062 136.714844 L 95.070312 159.507812 L 124.351562 175.136719 L 185.53125 138.6875 L 297.492188 204.417969 L 300.753906 243.480469 L 350.859375 271.472656 L 347.632812 173.84375 L 190.117188 83.996094 Z M 97.039062 136.714844 "
              fillOpacity="1"
              fillRule="evenodd"
            />
          </g>
        </g>

        {/* Navigation Items */}

        <text x="35" y="90" fill="#f0f6fc" fontSize="12" fontFamily="system-ui">
          {' '}
          Dashboard
        </text>

        <text
          x="35"
          y="135"
          fill="#f0f6fc"
          fontSize="12"
          fontFamily="system-ui"
        >
          {' '}
          Problems
        </text>

        <rect x="20" y="160" width="160" height="35" fill="#1f6feb" rx="6" />
        <text
          x="35"
          y="180"
          fill="#f0f6fc"
          fontSize="12"
          fontFamily="system-ui"
        >
          {' '}
          Code Environment
        </text>

        {/* Problem Description Panel */}
        <rect
          x="200"
          y="0"
          width="550"
          height="800"
          fill="url(#problemGradient)"
        />

        {/* Problem Header */}
        <text
          x="220"
          y="60"
          fill="#24292f"
          fontSize="24"
          fontFamily="system-ui"
          fontWeight="600"
        >
          Two Sum
        </text>

        {/* Difficulty Badge */}
        <rect x="330" y="40" width="60" height="25" fill="#f0fff4" rx="12" />
        <text
          x="350"
          y="57"
          fill="#276749"
          fontSize="11"
          fontFamily="system-ui"
          fontWeight="500"
        >
          Easy
        </text>

        {/* Highlight Mode */}
        <text
          x="220"
          y="110"
          fill="#6c757d"
          fontSize="12"
          fontFamily="system-ui"
        >
          🎨 Highlight Mode
        </text>
        <circle cx="350" cy="106" r="6" fill="#28a745" />
        <circle cx="370" cy="106" r="6" fill="#ffc107" />
        <circle cx="390" cy="106" r="6" fill="#007bff" />
        <circle cx="410" cy="106" r="6" fill="#dc3545" />
        <circle cx="430" cy="106" r="6" fill="#6f42c1" />
        <circle cx="450" cy="106" r="6" fill="#fd7e14" />

        {/* Problem Description */}
        <text
          x="220"
          y="150"
          fill="#24292f"
          fontSize="13"
          fontFamily="system-ui"
        >
          Given an array of integers and an integer target, return indices of
          the two numbers
        </text>
        <text
          x="220"
          y="170"
          fill="#24292f"
          fontSize="13"
          fontFamily="system-ui"
        >
          such that they add up to the targe.
        </text>

        <text
          x="220"
          y="210"
          fill="#24292f"
          fontSize="13"
          fontFamily="system-ui"
        >
          You may assume that each input would have exactly one solution, and
          you may
        </text>
        <text
          x="220"
          y="230"
          fill="#24292f"
          fontSize="13"
          fontFamily="system-ui"
        >
          not use the same element twice.
        </text>

        {/* Examples */}
        <text
          x="220"
          y="270"
          fill="#24292f"
          fontSize="14"
          fontFamily="system-ui"
          fontWeight="600"
        >
          Example 1
        </text>

        <rect x="220" y="295" width="500" height="30" fill="#f6f8fa" rx="4" />
        <text
          x="235"
          y="310"
          fill="#656d76"
          fontSize="12"
          fontFamily="monospace"
        >
          Input: nums = [2, 7, 11, 15], target = 9
        </text>

        <rect x="220" y="340" width="500" height="30" fill="#f6f8fa" rx="4" />
        <text
          x="235"
          y="360"
          fill="#656d76"
          fontSize="12"
          fontFamily="monospace"
        >
          Output: [0, 1]
        </text>

        <text
          x="220"
          y="390"
          fill="#656d76"
          fontSize="12"
          fontFamily="system-ui"
        >
          Explanation:
        </text>
        <text
          x="220"
          y="405"
          fill="#656d76"
          fontSize="12"
          fontFamily="system-ui"
        >
          Because nums[0] + nums[1] == 9, we return [0, 1].
        </text>

        {/* Example 2 */}
        <text
          x="220"
          y="430"
          fill="#24292f"
          fontSize="14"
          fontFamily="system-ui"
          fontWeight="600"
        >
          Example 2
        </text>

        <rect x="220" y="460" width="500" height="30" fill="#f6f8fa" rx="4" />
        <text
          x="235"
          y="480"
          fill="#656d76"
          fontSize="12"
          fontFamily="monospace"
        >
          Input: nums = [3, 2, 4], target = 6
        </text>

        <rect x="220" y="500" width="500" height="30" fill="#f6f8fa" rx="4" />
        <text
          x="235"
          y="520"
          fill="#656d76"
          fontSize="12"
          fontFamily="monospace"
        >
          Output: [1, 2]
        </text>

        {/* Constraints */}
        <text
          x="220"
          y="570"
          fill="#24292f"
          fontSize="14"
          fontFamily="system-ui"
          fontWeight="600"
        >
          Constraints
        </text>

        <rect x="220" y="590" width="500" height="120" fill="#f6f8fa" rx="4" />
        <text
          x="235"
          y="610"
          fill="#656d76"
          fontSize="11"
          fontFamily="monospace"
        >
          2 &lt;= nums.length &lt;= 10⁴
        </text>
        <text
          x="235"
          y="630"
          fill="#656d76"
          fontSize="11"
          fontFamily="monospace"
        >
          -10⁹ &lt;= nums[i] &lt;= 10⁹
        </text>
        <text
          x="235"
          y="650"
          fill="#656d76"
          fontSize="11"
          fontFamily="monospace"
        >
          -10⁹ &lt;= target &lt;= 10⁹
        </text>
        <text
          x="235"
          y="670"
          fill="#656d76"
          fontSize="11"
          fontFamily="monospace"
        >
          Only one valid answer exists.
        </text>

        {/* Code Editor Panel */}
        <rect
          x="750"
          y="0"
          width="650"
          height="800"
          fill="url(#codeGradient)"
        />

        {/* Code Editor Header */}
        <rect x="750" y="0" width="650" height="40" fill="#21262d" />
        <text
          x="760"
          y="25"
          fill="#f0f6fc"
          fontSize="14"
          fontFamily="system-ui"
          fontWeight="500"
        >
          Code Editor
        </text>
        <text
          x="1300"
          y="25"
          fill="#58a6ff"
          fontSize="12"
          fontFamily="system-ui"
        >
          🐍 Python
        </text>

        {/* Code Content */}
        <text
          x="770"
          y="70"
          fill="#ff7b72"
          fontSize="13"
          fontFamily="monospace"
        >
          class
        </text>
        <text
          x="820"
          y="70"
          fill="#ffa657"
          fontSize="13"
          fontFamily="monospace"
        >
          Solution
        </text>
        <text
          x="890"
          y="70"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          :
        </text>

        <text
          x="790"
          y="95"
          fill="#ff7b72"
          fontSize="13"
          fontFamily="monospace"
        >
          def
        </text>
        <text
          x="830"
          y="95"
          fill="#79c0ff"
          fontSize="13"
          fontFamily="monospace"
        >
          twoSum
        </text>
        <text
          x="890"
          y="95"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          (
        </text>
        <text
          x="900"
          y="95"
          fill="#ff7b72"
          fontSize="13"
          fontFamily="monospace"
        >
          self
        </text>
        <text
          x="940"
          y="95"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          ,
        </text>
        <text
          x="955"
          y="95"
          fill="#ffa657"
          fontSize="13"
          fontFamily="monospace"
        >
          nums
        </text>
        <text
          x="1000"
          y="95"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          ,
        </text>
        <text
          x="1015"
          y="95"
          fill="#ffa657"
          fontSize="13"
          fontFamily="monospace"
        >
          target
        </text>
        <text
          x="1070"
          y="95"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          ):
        </text>

        <text
          x="810"
          y="120"
          fill="#ff7b72"
          fontSize="13"
          fontFamily="monospace"
        >
          pass
        </text>

        <text
          x="770"
          y="160"
          fill="#8b949e"
          fontSize="13"
          fontFamily="monospace"
        >
          if __name__ == &quot;__main__&quot;:
        </text>
        <text
          x="790"
          y="185"
          fill="#ffa657"
          fontSize="13"
          fontFamily="monospace"
        >
          sol
        </text>
        <text
          x="825"
          y="185"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          =
        </text>
        <text
          x="845"
          y="185"
          fill="#79c0ff"
          fontSize="13"
          fontFamily="monospace"
        >
          Solution
        </text>
        <text
          x="920"
          y="185"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          ()
        </text>

        <text
          x="790"
          y="210"
          fill="#79c0ff"
          fontSize="13"
          fontFamily="monospace"
        >
          print
        </text>
        <text
          x="830"
          y="210"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          (
        </text>
        <text
          x="840"
          y="210"
          fill="#ffa657"
          fontSize="13"
          fontFamily="monospace"
        >
          sol
        </text>
        <text
          x="870"
          y="210"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          .
        </text>
        <text
          x="880"
          y="210"
          fill="#79c0ff"
          fontSize="13"
          fontFamily="monospace"
        >
          twoSum
        </text>
        <text
          x="940"
          y="210"
          fill="#f0f6fc"
          fontSize="13"
          fontFamily="monospace"
        >
          ())
        </text>

        {/* Cursor */}
        <rect x="850" y="110" width="2" height="15" fill="#58a6ff">
          <animate
            attributeName="opacity"
            values="1;0;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Test Cases Panel */}
        <rect
          x="750"
          y="580"
          width="650"
          height="220"
          fill="#0d1117"
          stroke="#30363d"
          strokeWidth="1"
        />

        {/* Test Cases Header */}
        <rect x="750" y="580" width="650" height="35" fill="#161b22" />
        <text
          x="770"
          y="602"
          fill="#58a6ff"
          fontSize="12"
          fontFamily="system-ui"
          fontWeight="500"
        >
          Test Cases
        </text>
        <text
          x="870"
          y="602"
          fill="#8b949e"
          fontSize="12"
          fontFamily="system-ui"
        >
          Output
        </text>
        <text
          x="950"
          y="602"
          fill="#8b949e"
          fontSize="12"
          fontFamily="system-ui"
        >
          Console
        </text>

        {/* Run and Test Buttons */}
        <rect x="1265" y="585" width="60" height="25" fill="#238636" rx="4" />
        <text
          x="1275"
          y="601"
          fill="#ffffff"
          fontSize="11"
          fontFamily="system-ui"
          fontWeight="500"
        >
          ▶ Run
        </text>

        <rect x="1335" y="585" width="60" height="25" fill="#1f6feb" rx="4" />
        <text
          x="1345"
          y="601"
          fill="#ffffff"
          fontSize="11"
          fontFamily="system-ui"
          fontWeight="500"
        >
          🧪 Test
        </text>

        {/* Test Cases Content */}
        <text
          x="770"
          y="635"
          fill="#58a6ff"
          fontSize="12"
          fontFamily="system-ui"
          fontWeight="500"
        >
          Test Cases
        </text>

        <text
          x="970"
          y="635"
          fill="#f0f6fc"
          fontSize="10"
          fontFamily="system-ui"
        >
          +
        </text>

        <rect x="770" y="650" width="150" height="30" fill="#21262d" rx="4" />
        <text
          x="780"
          y="670"
          fill="#f0f6fc"
          fontSize="11"
          fontFamily="system-ui"
        >
          Case 1
        </text>

        <rect
          x="770"
          y="690"
          width="150"
          height="30"
          fill="#0d1117"
          rx="4"
          stroke="#30363d"
          strokeWidth="1"
        />
        <text
          x="780"
          y="710"
          fill="#8b949e"
          fontSize="11"
          fontFamily="system-ui"
        >
          Case 2
        </text>

        <rect
          x="770"
          y="730"
          width="150"
          height="30"
          fill="#0d1117"
          rx="4"
          stroke="#30363d"
          strokeWidth="1"
        />
        <text
          x="780"
          y="750"
          fill="#8b949e"
          fontSize="11"
          fontFamily="system-ui"
        >
          Case 3
        </text>

        {/* Input/Output Panel */}
        <rect
          x="940"
          y="630"
          width="450"
          height="160"
          fill="#0d1117"
          stroke="#30363d"
          strokeWidth="1"
        />
        <text
          x="955"
          y="650"
          fill="#8b949e"
          fontSize="10"
          fontFamily="system-ui"
        >
          Input:
        </text>
        <text
          x="955"
          y="670"
          fill="#a5a5a5"
          fontSize="11"
          fontFamily="monospace"
        >
          [2,7,11,15], target = 9
        </text>

        <text
          x="955"
          y="700"
          fill="#8b949e"
          fontSize="10"
          fontFamily="system-ui"
        >
          Expected Output:
        </text>
        <text
          x="955"
          y="720"
          fill="#a5a5a5"
          fontSize="11"
          fontFamily="monospace"
        >
          [0,1]
        </text>

        {/* Bottom Action Bar */}
        <rect x="600" y="780" width="1200" height="20" fill="#e9ecef" />
        <text
          x="720"
          y="795"
          fill="#58a6ff"
          fontSize="10"
          fontFamily="system-ui"
        >
          {' '}
          Start Session
        </text>
        <text
          x="820"
          y="795"
          fill="#58a6ff"
          fontSize="10"
          fontFamily="system-ui"
        >
          {' '}
          New Problem
        </text>
        <text
          x="920"
          y="795"
          fill="#58a6ff"
          fontSize="10"
          fontFamily="system-ui"
        >
          {' '}
          Pomodoro
        </text>
        <text
          x="1020"
          y="795"
          fill="#58a6ff"
          fontSize="10"
          fontFamily="system-ui"
        >
          {' '}
          Notes
        </text>
        <text
          x="1120"
          y="795"
          fill="#58a6ff"
          fontSize="10"
          fontFamily="system-ui"
        >
          {' '}
          Canvas
        </text>
        <text
          x="1220"
          y="795"
          fill="#58a6ff"
          fontSize="10"
          fontFamily="system-ui"
        >
          {' '}
          Visualize
        </text>
        <text
          x="1320"
          y="795"
          fill="#58a6ff"
          fontSize="10"
          fontFamily="system-ui"
        >
          {' '}
          AI Tutor
        </text>
      </svg>
    </>
  );
}
