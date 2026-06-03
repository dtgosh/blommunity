// 게시물 상세 + 댓글 — U-PT-03, U-CM-01~06 (✅)
import { PostDetailScreen } from "@/components/posts/post-detail-screen";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <PostDetailScreen postId={postId} />;
}
