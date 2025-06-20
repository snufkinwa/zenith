type Action<
  TType extends string,
  TPayload = undefined
> = TPayload extends undefined
  ? {
      type: TType;
    }
  : {
      type: TType;
      payload: TPayload;
    };

// PART 1: State Type and Initial State Value
export const userSlots = {
  pink: true,
  red: true,
  blue: true,
  purple: true,
  green: true,
  orange: true,
};

export type UserSlot = keyof typeof userSlots;

export type SessionUser = {
  id: string;
  name: string;
  userSlot: UserSlot;
  isActive: boolean;
  cursor?: { x: number; y: number };
  lastSeen: number;
};

export type ChatMessage = {
  content: string;
  atTimestamp: number;
  userSlot: UserSlot;
  userId: string;
  userName: string;
  type: 'user' | 'ai' | 'system';
};

export type AIInteraction = {
  id: string;
  query: string;
  response: string;
  mode: 'hint' | 'tutor';
  requestedBy: UserSlot;
  atTimestamp: number;
  toolRequests?: Array<{
    tool: string;
    message: string;
    approved: boolean;
    approvedBy?: UserSlot[];
  }>;
};

export type SharedCode = {
  content: string;
  language: string;
  lastModifiedBy: UserSlot;
  lastModifiedAt: number;
  cursor?: {
    line: number;
    column: number;
    userSlot: UserSlot;
  };
};

export type SharedNotes = {
  content: string;
  lastModifiedBy: UserSlot;
  lastModifiedAt: number;
};

export type CanvasState = {
  elements: any[]; // Canvas drawing elements
  lastModifiedBy: UserSlot;
  lastModifiedAt: number;
};

export type CodingSessionState = {
  // User management
  userSlots: {
    [slot in UserSlot]: boolean;
  };
  users: SessionUser[];
  
  // Chat and AI interactions
  messages: ChatMessage[];
  aiInteractions: AIInteraction[];
  
  // Shared workspace
  currentProblem?: {
    id: string;
    title: string;
    difficulty: string;
  };
  sharedCode: SharedCode;
  sharedNotes: SharedNotes;
  canvasState: CanvasState;
  
  // Session metadata
  sessionId: string;
  createdAt: number;
  lastActivity: number;
  aiModeratorEnabled: boolean;
};

export const initialCodingSessionState: CodingSessionState = {
  userSlots,
  users: [],
  messages: [],
  aiInteractions: [],
  sharedCode: {
    content: '',
    language: 'python',
    lastModifiedBy: 'pink',
    lastModifiedAt: Date.now(),
  },
  sharedNotes: {
    content: '',
    lastModifiedBy: 'pink',
    lastModifiedAt: Date.now(),
  },
  canvasState: {
    elements: [],
    lastModifiedBy: 'pink',
    lastModifiedAt: Date.now(),
  },
  sessionId: '',
  createdAt: Date.now(),
  lastActivity: Date.now(),
  aiModeratorEnabled: true,
};

// PART 2: Action Types
export type CodingSessionActions =
  // User actions
  | Action<'user_join', {
      userSlot: UserSlot;
      userId: string;
      userName: string;
    }>
  | Action<'user_leave', {
      userSlot: UserSlot;
      userId: string;
    }>
  | Action<'user_cursor_update', {
      userSlot: UserSlot;
      cursor: { x: number; y: number };
    }>
  
  // Chat actions
  | Action<'chat_message', {
      userSlot: UserSlot;
      userId: string;
      userName: string;
      content: string;
      atTimestamp: number;
    }>
  
  // AI actions
  | Action<'ai_query', {
      query: string;
      mode: 'hint' | 'tutor';
      requestedBy: UserSlot;
      atTimestamp: number;
    }>
  | Action<'ai_response', {
      interactionId: string;
      response: string;
      toolRequests?: Array<{
        tool: string;
        message: string;
      }>;
    }>
  | Action<'ai_tool_approve', {
      interactionId: string;
      toolIndex: number;
      approvedBy: UserSlot;
    }>
  | Action<'ai_moderator_message', {
      content: string;
      atTimestamp: number;
      context?: string;
    }>
  
  // Workspace actions
  | Action<'code_update', {
      content: string;
      userSlot: UserSlot;
      atTimestamp: number;
    }>
  | Action<'code_cursor_update', {
      line: number;
      column: number;
      userSlot: UserSlot;
    }>
  | Action<'notes_update', {
      content: string;
      userSlot: UserSlot;
      atTimestamp: number;
    }>
  | Action<'canvas_update', {
      elements: any[];
      userSlot: UserSlot;
      atTimestamp: number;
    }>
  | Action<'problem_change', {
      problemId: string;
      title: string;
      difficulty: string;
      changedBy: UserSlot;
    }>
  
  // Session management
  | Action<'session_init', {
      sessionId: string;
    }>
  | Action<'toggle_ai_moderator', {
      enabled: boolean;
      toggledBy: UserSlot;
    }>;

// PART 3: The Reducer – This is where all the logic happens
export default (
  state = initialCodingSessionState, 
  action: CodingSessionActions
): CodingSessionState => {
  
  // Session initialization
  if (action.type === 'session_init') {
    return {
      ...state,
      sessionId: action.payload.sessionId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };
  }
  
  // User joins the session
  else if (action.type === 'user_join') {
    const { userSlot, userId, userName } = action.payload;
    
    const newUser: SessionUser = {
      id: userId,
      name: userName,
      userSlot,
      isActive: true,
      lastSeen: Date.now(),
    };
    
    const systemMessage: ChatMessage = {
      content: `${userName} joined the session`,
      atTimestamp: Date.now(),
      userSlot: 'pink', // System messages use pink slot
      userId: 'system',
      userName: 'System',
      type: 'system',
    };
    
    return {
      ...state,
      userSlots: {
        ...state.userSlots,
        [userSlot]: false,
      },
      users: [...state.users, newUser],
      messages: [...state.messages, systemMessage],
      lastActivity: Date.now(),
    };
  }
  
  // User leaves the session
  else if (action.type === 'user_leave') {
    const { userSlot, userId } = action.payload;
    const user = state.users.find(u => u.id === userId);
    
    const systemMessage: ChatMessage = {
      content: `${user?.name || 'User'} left the session`,
      atTimestamp: Date.now(),
      userSlot: 'pink',
      userId: 'system',
      userName: 'System',
      type: 'system',
    };
    
    return {
      ...state,
      userSlots: {
        ...state.userSlots,
        [userSlot]: true,
      },
      users: state.users.filter(u => u.id !== userId),
      messages: [...state.messages, systemMessage],
      lastActivity: Date.now(),
    };
  }
  
  // User cursor update
  else if (action.type === 'user_cursor_update') {
    const { userSlot, cursor } = action.payload;
    
    return {
      ...state,
      users: state.users.map(user => 
        user.userSlot === userSlot 
          ? { ...user, cursor, lastSeen: Date.now() }
          : user
      ),
    };
  }
  
  // Chat message
  else if (action.type === 'chat_message') {
    const { userSlot, userId, userName, content, atTimestamp } = action.payload;
    
    const newMessage: ChatMessage = {
      content,
      atTimestamp,
      userSlot,
      userId,
      userName,
      type: 'user',
    };
    
    return {
      ...state,
      messages: [...state.messages, newMessage],
      lastActivity: Date.now(),
    };
  }
  
  // AI query initiated
  else if (action.type === 'ai_query') {
    const { query, mode, requestedBy, atTimestamp } = action.payload;
    
    const newInteraction: AIInteraction = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query,
      response: '', // Will be filled by ai_response action
      mode,
      requestedBy,
      atTimestamp,
    };
    
    const queryMessage: ChatMessage = {
      content: `🤖 AI ${mode === 'hint' ? 'Hint' : 'Tutor'} Request: ${query}`,
      atTimestamp,
      userSlot: requestedBy,
      userId: 'ai-query',
      userName: 'AI Request',
      type: 'system',
    };
    
    return {
      ...state,
      aiInteractions: [...state.aiInteractions, newInteraction],
      messages: [...state.messages, queryMessage],
      lastActivity: Date.now(),
    };
  }
  
  // AI response received
  else if (action.type === 'ai_response') {
    const { interactionId, response, toolRequests } = action.payload;
    
    const aiMessage: ChatMessage = {
      content: `🤖 AI: ${response}`,
      atTimestamp: Date.now(),
      userSlot: 'purple', // AI uses purple slot
      userId: 'ai-tutor',
      userName: 'AI Tutor',
      type: 'ai',
    };
    
    return {
      ...state,
      aiInteractions: state.aiInteractions.map(interaction =>
        interaction.id === interactionId
          ? { 
              ...interaction, 
              response,
              toolRequests: toolRequests?.map(req => ({
                ...req,
                approved: false,
                approvedBy: [],
              }))
            }
          : interaction
      ),
      messages: [...state.messages, aiMessage],
      lastActivity: Date.now(),
    };
  }
  
  // AI tool approval
  else if (action.type === 'ai_tool_approve') {
    const { interactionId, toolIndex, approvedBy } = action.payload;
    
    return {
      ...state,
      aiInteractions: state.aiInteractions.map(interaction =>
        interaction.id === interactionId && interaction.toolRequests
          ? {
              ...interaction,
              toolRequests: interaction.toolRequests.map((req, index) =>
                index === toolIndex
                  ? {
                      ...req,
                      approved: true,
                      approvedBy: [...(req.approvedBy || []), approvedBy],
                    }
                  : req
              ),
            }
          : interaction
      ),
      lastActivity: Date.now(),
    };
  }
  
  // AI moderator message (autonomous AI suggestions)
  else if (action.type === 'ai_moderator_message') {
    const { content, atTimestamp, context } = action.payload;
    
    const moderatorMessage: ChatMessage = {
      content: `🧠 AI Moderator: ${content}`,
      atTimestamp,
      userSlot: 'orange', // Moderator uses orange slot
      userId: 'ai-moderator',
      userName: 'AI Moderator',
      type: 'ai',
    };
    
    return {
      ...state,
      messages: [...state.messages, moderatorMessage],
      lastActivity: Date.now(),
    };
  }
  
  // Code update
  else if (action.type === 'code_update') {
    const { content, userSlot, atTimestamp } = action.payload;
    
    return {
      ...state,
      sharedCode: {
        content,
        language: state.sharedCode.language,
        lastModifiedBy: userSlot,
        lastModifiedAt: atTimestamp,
      },
      lastActivity: Date.now(),
    };
  }
  
  // Code cursor update
  else if (action.type === 'code_cursor_update') {
    const { line, column, userSlot } = action.payload;
    
    return {
      ...state,
      sharedCode: {
        ...state.sharedCode,
        cursor: { line, column, userSlot },
      },
    };
  }
  
  // Notes update
  else if (action.type === 'notes_update') {
    const { content, userSlot, atTimestamp } = action.payload;
    
    return {
      ...state,
      sharedNotes: {
        content,
        lastModifiedBy: userSlot,
        lastModifiedAt: atTimestamp,
      },
      lastActivity: Date.now(),
    };
  }
  
  // Canvas update
  else if (action.type === 'canvas_update') {
    const { elements, userSlot, atTimestamp } = action.payload;
    
    return {
      ...state,
      canvasState: {
        elements,
        lastModifiedBy: userSlot,
        lastModifiedAt: atTimestamp,
      },
      lastActivity: Date.now(),
    };
  }
  
  // Problem change
  else if (action.type === 'problem_change') {
    const { problemId, title, difficulty, changedBy } = action.payload;
    
    const user = state.users.find(u => u.userSlot === changedBy);
    const systemMessage: ChatMessage = {
      content: `${user?.name || 'Someone'} changed the problem to: ${title}`,
      atTimestamp: Date.now(),
      userSlot: 'pink',
      userId: 'system',
      userName: 'System',
      type: 'system',
    };
    
    return {
      ...state,
      currentProblem: {
        id: problemId,
        title,
        difficulty,
      },
      messages: [...state.messages, systemMessage],
      lastActivity: Date.now(),
    };
  }
  
  // Toggle AI moderator
  else if (action.type === 'toggle_ai_moderator') {
    const { enabled, toggledBy } = action.payload;
    const user = state.users.find(u => u.userSlot === toggledBy);
    
    const systemMessage: ChatMessage = {
      content: `${user?.name || 'Someone'} ${enabled ? 'enabled' : 'disabled'} AI Moderator`,
      atTimestamp: Date.now(),
      userSlot: 'pink',
      userId: 'system',
      userName: 'System',
      type: 'system',
    };
    
    return {
      ...state,
      aiModeratorEnabled: enabled,
      messages: [...state.messages, systemMessage],
      lastActivity: Date.now(),
    };
  }
  
  return state;
};