-- Phase 3.1: document vault storage (SECURITY.md §5).
-- Private bucket, path `{business_id}/documents/{uuid}` — same shape as the
-- ca-photos bucket from Phase 2.2, viewed only via short-TTL signed URLs.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

create policy "owner can upload documents for their business"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'documents'
  and is_business_owner((storage.foldername(name))[1]::uuid)
);

create policy "owner can read documents for their business"
on storage.objects for select
to authenticated
using (
  bucket_id = 'documents'
  and is_business_owner((storage.foldername(name))[1]::uuid)
);

-- No storage DELETE policy: documents are soft-deleted at the row level
-- (deleted_at), same as equipment/checklists — the file itself is left in
-- place, matching the rest of the app's soft-delete convention.

-- Generic reference for per-entity notification dedup — Phase 3.1 needs to
-- track "already sent the 30-day/7-day expiry reminder for THIS document",
-- not just "already sent this template today" like Phase 2.4's reminders.
alter table notifications_log add column related_id uuid;
