"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth-guard";

export default function ProjectsPage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Authentication Required</div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Projects View</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Project management functionality coming soon...</p>
        </div>
      </div>
    </AuthGuard>
  );
}