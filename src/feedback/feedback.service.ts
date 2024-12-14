import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackType } from 'src/util/enums/feedback-type.enum';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackRepository)
    private readonly FeedbackRepository: FeedbackRepository,
  ) {}

  async addFeedback(fromUserId: string, toUserId: string, feedback: FeedbackType): Promise<void> {
    if (fromUserId === toUserId) {
      throw new Error('Usuário não pode dar feedback para si próprio');
    }
    await this.FeedbackRepository.addOrUpdateFeedback(fromUserId, toUserId, feedback);
  }

  async removeFeedback(fromUserId: string, toUserId: string): Promise<void> {
    await this.FeedbackRepository.removeFeedback(fromUserId, toUserId);
  }

  async getFeedbackCounts(userId: string): Promise<{ likes: number; dislikes: number }> {
    return await this.FeedbackRepository.getFeedbackCounts(userId);
  }
}