import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ default: '' })
  profileImage: string;

  @Column({ default: '' })
  shortDescription: string;

  @Column({ default: '' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}