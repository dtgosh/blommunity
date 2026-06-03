// 게시판 상세 (글 목록) — U-PT-02 (✅)
import { BoardScreen } from "@/components/posts/board-screen";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  return <BoardScreen boardId={boardId} />;
}
