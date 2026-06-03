"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { avatarIdx } from "@/lib/avatar";
import { formatRelative, snippet } from "@/lib/format";
import type { components } from "@/lib/api/types";

/** A post entry in a board's list. Author name is resolved by the parent. */
export function PostRow({
  post,
  authorName,
}: {
  post: components["schemas"]["PostEntity"];
  authorName: string;
}) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex flex-col gap-2 border-b border-line px-1 py-4 last:border-b-0"
    >
      <h3 className="text-[15px] font-bold text-ink group-hover:text-accent-text">
        {post.title}
      </h3>
      <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-3">
        {snippet(post.content)}
      </p>
      <div className="flex items-center gap-2.5 text-[12px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <Avatar name={authorName} idx={avatarIdx(post.authorId)} size={20} />
          <span className="font-medium text-ink-2">{authorName}</span>
        </span>
        <span>·</span>
        <span className="bl-tnum">{formatRelative(post.createdAt)}</span>
        <span className="ml-auto flex items-center gap-1">
          <Icon name="comment" size={14} />
          <span className="bl-tnum">{post.commentCount}</span>
        </span>
      </div>
    </Link>
  );
}
