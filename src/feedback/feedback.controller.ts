import { Controller, Post, Delete, Get, Param, Body, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackType } from 'src/util/enums/feedback-type.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiSecurity } from '@nestjs/swagger';
import { PostFeedbackDto } from 'src/dtos/feedback/post-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly FeedbackService: FeedbackService) {}

  @Post(':toUserId')
  @ApiSecurity("JWT-auth")
  @UseGuards(JwtAuthGuard)
  async addFeedback(
    @Param('toUserId') toUserId: string,
    @Body() {feedback, fromUserId}: PostFeedbackDto,
  ): Promise<void> {
    await this.FeedbackService.addFeedback(fromUserId, toUserId, feedback);
  }

  @Delete(':toUserId')
  @ApiSecurity("JWT-auth")
  @UseGuards(JwtAuthGuard)
  async removeFeedback(
    @Body() fromUserId: string,
    @Param('toUserId') toUserId: string,
  ): Promise<void> {
    await this.FeedbackService.removeFeedback(fromUserId, toUserId);
  }

  @Get(':userId/counts')
  async getFeedbackCounts(@Param('userId') userId: string): Promise<{ likes: number; dislikes: number }> {
    console.log(this.FeedbackService.getFeedbackCounts)
    return await this.FeedbackService.getFeedbackCounts(userId);
  }
}