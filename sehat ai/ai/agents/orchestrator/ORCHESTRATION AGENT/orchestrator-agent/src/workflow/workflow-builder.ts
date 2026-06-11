import { WorkflowDefinition, WorkflowInput } from "../interfaces/workflow";
import { PipelineManager } from "../core/pipeline-manager";

export class WorkflowBuilder {
  private pipelineManager = new PipelineManager();

  public build(input: WorkflowInput): WorkflowDefinition {
    return this.pipelineManager.buildPipeline(input);
  }
}
