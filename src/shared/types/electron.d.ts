declare global {
    interface Window {
      electron: {
        showOpenDialog: (options: any) => Promise<{
          canceled: boolean;
          filePaths: string[];
        }>;
      };
    }
  }
  
  export {};