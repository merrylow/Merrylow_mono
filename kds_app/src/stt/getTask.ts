import AiTastAnalyzer from "./AiTaskAnlalyzer";
import localAI from "./localAI";
import performTask from "./performTask";

type ReturnType = {
  data: Record<string, unknown>;
  message: string;
};

const getTask = async (vendorSpeech: string): Promise<ReturnType> => {
  try {
    const task = await AiTastAnalyzer(vendorSpeech).catch(() =>
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
