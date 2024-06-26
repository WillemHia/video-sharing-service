import { IsNotEmpty } from 'class-validator';

export class UpdateFollowRelationshipDto {
  @IsNotEmpty()
  followedId: number;
}
