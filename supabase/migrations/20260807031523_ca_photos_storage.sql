-- Private storage bucket for corrective-action photos (SECURITY.md §5:
-- `{business_id}/ca/{uuid}`, private, signed URL only). Same shape as Solo
-- Sitter's visit-photos bucket: policies parse business_id out of the
-- object path's first folder segment.

insert into storage.buckets (id, name, public)
values ('ca-photos', 'ca-photos', false);

create policy "owner can upload ca photos for their business"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'ca-photos'
  and is_business_owner((storage.foldername(name))[1]::uuid)
);

create policy "owner can read ca photos for their business"
on storage.objects for select
to authenticated
using (
  bucket_id = 'ca-photos'
  and is_business_owner((storage.foldername(name))[1]::uuid)
);
