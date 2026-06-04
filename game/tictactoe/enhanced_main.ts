import { enhancedTrain } from "./enhanced_train.ts";
import { QLearningAgent } from "./qagent.ts";
import { Player } from "./types.ts";
import {
  playHumanVsAICollectData,
  playMultipleGames,
} from "./enhanced_play.ts";

async function main() {
  console.log("🎮 增强版井字棋训练系统\n");

  while (true) {
    console.log("请选择操作:");
    console.log("1. 🚀 从零开始训练新 AI");
    console.log("2. 📊 基于现有数据继续训练");
    console.log("3. 🎯 挑战训练好的 AI");
    console.log("4. 📈 查看人类玩家数据统计");
    console.log("5. 🔄 连续多局挑战");
    console.log("6. 🗑️ 清空历史数据");
    console.log("7. ❌ 退出");

    const choice = prompt("请输入选项 (1-7): ")!;

    switch (choice) {
      case "1": {
        // 从零开始训练
        const trainEpisodes = parseInt(
          prompt("训练轮数 (默认 100000): ") || "100000",
        );
        const imitationWeight = parseFloat(
          prompt("模仿学习权重 (0.1-0.5, 默认 0.3): ") || "0.3",
        );

        console.log("\n🚀 开始训练新 AI...");
        const [agentX] = await enhancedTrain({
          trainEpisodes: trainEpisodes,
          useHumanData: false,
          imitationWeight: imitationWeight,
          explorationDecay: 0.9995,
          finalExplorationRate: 0.05,
        });

        // 立即进行人机对战，收集数据
        console.log("\n🎯 训练完成！现在可以挑战 AI 了...");
        playHumanVsAICollectData(agentX);
        break;
      }

      case "2": {
        // 基于现有数据继续训练
        const trainEpisodes = parseInt(
          prompt("额外训练轮数 (默认 50000): ") || "50000",
        );
        const imitationWeight = parseFloat(
          prompt("模仿学习权重 (0.1-0.5, 默认 0.3): ") || "0.3",
        );

        console.log("\n🚀 基于现有数据继续训练...");
        const [agentX] = await enhancedTrain({
          trainEpisodes: trainEpisodes,
          useHumanData: true,
          imitationWeight: imitationWeight,
        });

        playHumanVsAICollectData(agentX);
        break;
      }

      case "3": {
        // 挑战现有的 AI
        try {
          // 尝试加载最新的训练模型
          const agentX = QLearningAgent.loadLatest();

          if (agentX) {
            console.log("✅ 加载了现有的 AI 模型");
            playHumanVsAICollectData(agentX);
          } else {
            console.log(
              "❌ 没有找到训练好的 AI 模型，请先选择选项 1 或 2 进行训练",
            );
          }
        } catch (e) {
          console.log("❌ 加载模型失败: " + (e as Error).message);
        }
        break;
      }

      case "4": {
        // 显示训练提示
        console.log("\n💡 训练提示:");
        console.log("- 每次人机对战都会直接优化 AI 的 Q 表");
        console.log("- AI 会逐渐学习人类的游戏策略");
        console.log("- 多次对战会让 AI 越来越懂你的思维方式");
        break;
      }

      case "5": {
        // 连续多局挑战
        try {
          // 尝试加载训练好的 AI，如果没有则使用新的
          const agentX = QLearningAgent.loadLatest() || new QLearningAgent(Player.X);

          if (QLearningAgent.loadLatest()) {
            console.log("\n🎯 使用训练好的 AI 进行连续对战:");
          } else {
            console.log("\n🎯 使用基础 AI 进行连续对战:");
          }
          console.log("- 所有对局都会直接更新 AI 的学习");
          const gamesCount = parseInt(
            prompt("要进行多少局游戏 (默认 5): ") || "5",
          );
          playMultipleGames(agentX, gamesCount);
        } catch (e) {
          console.log("❌ 发生错误: " + (e as Error).message);
        }
        break;
      }

      case "6": {
        // 显示当前 AI 状态
        console.log("\n📊 AI 学习状态:");
        console.log("- AI 已通过多次对战获得经验");
        console.log("- 所有学习内容都已整合到 Q 表中");
        console.log("- 无需额外的数据存储文件");
        break;
      }

      case "7": {
        console.log("👋 再见！");
        return;
      }

      default:
        console.log("⚠️ 无效选项，请重新输入");
    }
  }
}

main();
