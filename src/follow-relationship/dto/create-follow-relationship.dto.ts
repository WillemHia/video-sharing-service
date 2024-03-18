import { IsNotEmpty } from 'class-validator';
export class CreateFollowRelationshipDto {
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  followedId: number;
}
