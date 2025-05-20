export interface ModuleHandler {
  handleMessage: (message: string, knowledge: any, context: any) => Promise<string>;
}

export class ModuleRegistry {
  private modules: Map<string, ModuleHandler>;

  constructor() {
    this.modules = new Map();
  }

  public registerModule(moduleId: string, handler: ModuleHandler): void {
    this.modules.set(moduleId, handler);
  }

  public getModuleHandler(moduleId: string): ModuleHandler {
    const handler = this.modules.get(moduleId);
    
    if (!handler) {
      throw new Error(`No handler registered for module: ${moduleId}`);
    }
    
    return handler;
  }

  public getModuleIds(): string[] {
    return Array.from(this.modules.keys());
  }

  public hasModule(moduleId: string): boolean {
    return this.modules.has(moduleId);
  }
}
