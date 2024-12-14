import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Feedback } from './feedback.entity';
import { FeedbackType } from 'src/util/enums/feedback-type.enum';

@Injectable()
export class FeedbackRepository extends Repository<Feedback> {
  constructor(private readonly dataSource: DataSource) {
    super(Feedback, dataSource.createEntityManager());
  }

  // Adiciona ou atualiza um feedback
  async addOrUpdateFeedback(fromUserId: string, toUserId: string, feedback: FeedbackType): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .into(Feedback)
      .values({
        fromUser: { id: fromUserId }, // Relacionamento ManyToOne usa 'id' como referência
        toUser: { id: toUserId },
        feedback,
      })
      .orUpdate({
        conflict_target: ['fromUserId', 'toUserId'], // Nome das colunas no banco
        overwrite: ['feedback', 'createdAt'],
      })
      .execute();
  }

  // Remove um feedback
  async removeFeedback(fromUserId: string, toUserId: string): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from(Feedback)
      .where('fromUserId = :fromUserId', { fromUserId }) // Nome correto das colunas
      .andWhere('toUserId = :toUserId', { toUserId })
      .execute();
  }

  // Obtém contagem de likes e dislikes para um usuário
  async getFeedbackCounts(toUserId: string): Promise<{ likes: number; dislikes: number }> {
    const result = await this.createQueryBuilder('feedback')
      .select([
        `SUM(CASE WHEN feedback.feedback = :like THEN 1 ELSE 0 END) AS likes`,
        `SUM(CASE WHEN feedback.feedback = :dislike THEN 1 ELSE 0 END) AS dislikes`,
      ])
      .where('feedback.toUserId = :toUserId', { toUserId, like: FeedbackType.LIKE, dislike: FeedbackType.DISLIKE })
      .getRawOne();

    return {
      likes: parseInt(result.likes, 10) || 0,
      dislikes: parseInt(result.dislikes, 10) || 0,
    };
  }
}