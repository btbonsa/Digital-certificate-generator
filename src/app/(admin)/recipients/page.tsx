"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, Plus, RefreshCw, Search, Users, X, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { recipientsApi } from "@/features/recipients/api";
import type { Recipient } from "@/types/recipient";
import { brass } from "@/lib/organization";
import { toast } from "sonner";

const PAGE_SIZE = 20;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // The search that is actually applied to the list. Pagination uses this, not the text being typed.
  const [appliedSearch, setAppliedSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const loadRecipients = useCallback(async (search?: string, requestedPage = 1) => {
    try {
      const response = await recipientsApi.list(search, requestedPage, PAGE_SIZE);
      setRecipients(response.recipients);
      setPage(response.page);
      setTotal(response.total);
      setLimit(response.limit || PAGE_SIZE);
      setLoadError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load recipients";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    void loadRecipients();
  }, [loadRecipients]);

  const runLoad = (search: string, requestedPage: number) => {
    setSearching(true);
    setLoadError(null);
    void loadRecipients(search || undefined, requestedPage);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    setAppliedSearch(query);
    setPage(1);
    runLoad(query, 1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setAppliedSearch("");
    setPage(1);
    runLoad("", 1);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isFiltered = appliedSearch.length > 0;

  if (loading) {
    return (
      <div className="space-y-8" aria-label="Loading recipients" aria-busy="true">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="h-9 w-44 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-60 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="h-16 animate-pulse border-b border-border bg-muted/40" />
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-0">
              <div className="size-9 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="block h-1 w-10 rounded-full" style={{ backgroundColor: brass }} aria-hidden="true" />
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">Recipients</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage certificate recipients
            {total > 0 && <span> ({total.toLocaleString()} total)</span>}.
          </p>
        </div>
        <Link href="/recipients/new" className={buttonVariants()}>
          <Plus className="mr-2 size-4" aria-hidden="true" /> Add recipient
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <form
            onSubmit={handleSearch}
            role="search"
            className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center"
          >
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                aria-label="Search recipients by name"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={searching} className="flex-1 sm:flex-none">
                {searching ? (
                  <RefreshCw className="mr-2 size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="mr-2 size-4" aria-hidden="true" />
                )}
                Search
              </Button>
              {(isFiltered || searchQuery) && (
                <Button type="button" variant="outline" onClick={handleReset} disabled={searching}>
                  <X className="mr-2 size-4" aria-hidden="true" /> Clear
                </Button>
              )}
            </div>
          </form>

          {recipients.length === 0 && loadError ? (
            <div role="alert" className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <XCircle className="size-6" aria-hidden="true" />
              </span>
              <p className="font-serif text-xl font-medium text-foreground">Could not load recipients</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
              <Button className="mt-5" variant="outline" onClick={() => runLoad(appliedSearch, page)}>
                <RefreshCw className="mr-2 size-4" aria-hidden="true" /> Try again
              </Button>
            </div>
          ) : recipients.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              {isFiltered ? (
                <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Search className="size-6" aria-hidden="true" />
                </span>
              ) : (
                <span
                  className="mb-4 flex size-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: brass }}
                  aria-hidden="true"
                >
                  <Users className="size-6" />
                </span>
              )}
              <p className="font-serif text-xl font-medium text-foreground">
                {isFiltered ? "No recipients found" : "No recipients yet"}
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {isFiltered
                  ? `Nothing matches “${appliedSearch}”. Check the spelling or clear the search.`
                  : "Add the people you issue certificates to. You can then issue certificates to them."}
              </p>
              {isFiltered ? (
                <Button className="mt-5" variant="outline" onClick={handleReset}>
                  <X className="mr-2 size-4" aria-hidden="true" /> Clear search
                </Button>
              ) : (
                <Link href="/recipients/new" className={`${buttonVariants()} mt-5`}>
                  <Plus className="mr-2 size-4" aria-hidden="true" /> Add first recipient
                </Link>
              )}
            </div>
          ) : (
            <>
              {loadError && (
                <p
                  role="status"
                  className="mx-4 mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-muted-foreground"
                >
                  Refresh failed: {loadError}
                </p>
              )}

              <div aria-busy={searching} className={searching ? "opacity-60 transition-opacity" : "transition-opacity"}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wider">Recipient</TableHead>
                      <TableHead className="hidden text-xs font-semibold uppercase tracking-wider md:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="hidden text-xs font-semibold uppercase tracking-wider lg:table-cell">
                        Phone
                      </TableHead>
                      <TableHead className="hidden text-xs font-semibold uppercase tracking-wider lg:table-cell">
                        Created
                      </TableHead>
                      <TableHead className="pr-5 text-right">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipients.map((recipient) => (
                      <TableRow key={recipient.id}>
                        <TableCell className="pl-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                                {getInitials(recipient.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <Link
                                href={`/recipients/${recipient.id}`}
                                className="block truncate font-medium text-foreground hover:underline"
                              >
                                {recipient.full_name}
                              </Link>
                              {recipient.email && (
                                <p className="truncate text-xs text-muted-foreground md:hidden">{recipient.email}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {recipient.email || <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {recipient.phone || <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground lg:table-cell">
                          {formatDate(recipient.created_at)}
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          <Link
                            href={`/recipients/${recipient.id}`}
                            aria-label={`View ${recipient.full_name}`}
                            className={buttonVariants({ variant: "ghost", size: "icon" })}
                          >
                            <Eye className="size-4" aria-hidden="true" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {total > limit && (
                <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total.toLocaleString()}{" "}
                    recipients
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="mr-1 text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={searching || page <= 1}
                      onClick={() => runLoad(appliedSearch, page - 1)}
                    >
                      <ChevronLeft className="mr-1 size-4" aria-hidden="true" /> Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={searching || page * limit >= total}
                      onClick={() => runLoad(appliedSearch, page + 1)}
                    >
                      Next <ChevronRight className="ml-1 size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}