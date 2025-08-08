import AiTaskAnalyzer from "./AiTaskAnalyzer";
import localAI from "./localAI";
import performTask from "./performTask";

type ReturnType = {
  data: Record<string, unknown>;
  message: string;
};

export const getTask = async (vendorSpeech: string): Promise<ReturnType> => {
  try {
    const task = await AiTaskAnalyzer(vendorSpeech).catch(() =>
      localAI(vendorSpeech)
    );
    const [taskNumber, ...args] = task.split(",").map((s) => s.trim());
    return await performTask(taskNumber, args);
  } catch (error) {
    return {
      data: {},
      message: "An error occurred while processing the task.",
    };
  }
};
