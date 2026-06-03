import {
  Board,
  BoardCreateArgs,
  BoardFindManyArgs,
  BoardFindUniqueOrThrowArgs,
  BoardUpdateArgs,
  DbService,
} from '@app/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardService {
  constructor(private readonly dbService: DbService) {}

  public create(data: BoardCreateArgs['data']): Promise<Board> {
    return this.dbService.board.create({ data });
  }

  public findAll(where: BoardFindManyArgs['where']): Promise<Board[]> {
    return this.dbService.board.findMany({ where });
  }

  public findOne(where: BoardFindUniqueOrThrowArgs['where']): Promise<Board> {
    return this.dbService.board.findUniqueOrThrow({ where });
  }

  public update(args: BoardUpdateArgs): Promise<Board> {
    return this.dbService.board.update(args);
  }

  public async remove(where: BoardUpdateArgs['where']): Promise<void> {
    await this.dbService.board.update({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
