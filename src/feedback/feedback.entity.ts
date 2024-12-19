import { User } from 'src/user/user.entity';
import { FeedbackType } from 'src/util/enums/feedback-type.enum';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Unique, Check, JoinColumn } from 'typeorm';

@Entity('feedback')
@Unique(['fromUser', 'toUser']) // Garante unicidade para a combinação
@Check('"fromUserId" <> "toUserId"') // Impede interações consigo mesmo
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  fromUser: User;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  toUser: User;

  @Column({
    type: 'enum',
    enum: FeedbackType,
  })
  feedback: FeedbackType;

  @CreateDateColumn()
  createdAt: Date;
}