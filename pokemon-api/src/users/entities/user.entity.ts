// import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ length: 150 })
//   name: string;

//   @Column({ unique: true, length: 150 })
//   email: string;

//   @Column({ name: 'password_hash' })
//   passwordHash: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;
// }


// src/users/entities/user.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  // Nova coluna para guardar o avatar
  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}