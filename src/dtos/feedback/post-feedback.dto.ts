import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FeedbackType } from 'src/util/enums/feedback-type.enum';

export class PostFeedbackDto {
    @ApiProperty()
    @IsNotEmpty()
    fromUserId: string

    @ApiProperty()
    @IsNotEmpty()
    feedback: FeedbackType
}