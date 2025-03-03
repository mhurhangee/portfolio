export interface PreflightCheck {
    name: string;
    description: string;
    run: (params: PreflightParams) => Promise<CheckResult>;
  }
  
  export interface PreflightParams {
    userId: string;
    messages: Message[];
    lastMessage: string;
  }
  
  export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  export interface CheckResult {
    passed: boolean;
    code: string;
    message: string;
    details?: any;
    severity: 'warning' | 'error' | 'info';
  }
  
  export interface PreflightResult {
    passed: boolean;
    failedCheck?: string;
    result?: CheckResult;
  }
  
  export type ErrorDisplayConfig = {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
    severity: 'warning' | 'error' | 'info';
  }
  
  export type ErrorDisplayMap = {
    [checkCode: string]: (result: CheckResult) => ErrorDisplayConfig;
  }