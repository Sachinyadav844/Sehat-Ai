export interface AgentService<Input, Output> {
  analyze(input: Input): Promise<Output>;
  validate(output: Output): Promise<boolean>;
  execute(input: Input): Promise<Output>;
}
