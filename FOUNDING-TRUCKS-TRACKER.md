# FOUNDING-TRUCKS-TRACKER — Cohort source of truth

**Updated:** [YYYY-MM-DD]
**Owner:** [FOUNDER NAME]

This is the operational source of truth for the single Founding Trucks cohort.
Applications from Facebook, LinkedIn, NSFVA, NFTA, regional organizations, and
direct traffic all count toward the same 20-operator cap.

Do not store personal email addresses, phone numbers, private feedback, or other
sensitive information in this repository. Use an internal application ID or a
non-identifying alias and keep contact details in the approved private system.

## Capacity

| Allocation | Capacity | Accepted | Held | Available | Release rule |
|---|---:|---:|---:|---:|---|
| Social/direct | 15 | 0 | 0 | 15 | Available immediately |
| Organization-referred reserve | 5 | 0 | 0 | 5 | A hold requires an explicit partner agreement and expiry date |
| **Total cohort** | **20** | **0** | **0** | **20** | Never exceed 20 accepted operators |

The five reserved places are not a second cohort. A conversation does not lock all
five places. A partner hold exists only when the partner has replied positively,
the founder records an agreed `Reserved count`, and a `Hold until` date is set
below.

At the Day-30 review:

- Mark every lead that received the final note and still has not replied as
  `Closed — No response`. It holds zero places.
- Release all unused organization capacity to social/direct except the exact number
  covered by an active, unexpired partner hold.
- Release an active hold on its `Hold until` date unless referred applications have
  arrived or a new explicit date is agreed and recorded.

When capacity is released, increase the social/direct `Capacity` by the released
count and decrease organization `Capacity` by the same count. Recalculate both
`Available` values; total cohort capacity must remain 20. Record the transfer in the
partner hold register rather than silently changing the numbers.

Organization allocation math:
`Available = 5 - Accepted organization referrals - Active held places`.

Update the capacity table whenever a hold is created/released or an application
becomes `Accepted`/withdrawn. A submitted application does not consume a place
until accepted unless it is already covered by a recorded partner hold.

## Partner hold register

| Organization | Reserved count | Hold agreed | Hold until | Status | Release/extension decision |
|---|---:|---|---|---|---|
|  |  |  |  |  |  |

The sum of active `Reserved count` values plus accepted organization referrals must
never exceed five. When a held applicant becomes `Accepted`, reduce the hold by one
and increase the organization `Accepted` count by one; do not count both.

## Application register

| Application ID | Source | Applied | Status | Accepted | Activated | Feedback owner | Notes/next step |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

Allowed sources: `Facebook`, `LinkedIn`, `NSFVA`, `NFTA`, `Regional org`,
`Commissary`, `Direct`, `Other`.

Allowed statuses: `Applied`, `Reviewing`, `Waitlisted`, `Accepted`, `Activated`,
`Declined`, `Withdrawn`, `Completed`.

## Counting rules

- Count a place only when the status becomes `Accepted`.
- An `Activated` operator still occupies the same accepted place; do not count it
  twice.
- An accepted operator who withdraws before onboarding returns one place to the
  same allocation unless the founder records a deliberate reallocation.
- If the social/direct allocation reaches 15, every additional social/direct
  applicant must use status `Waitlisted`—never `Accepted`—until a place opens or
  unused organization capacity is formally released.
- Every acceptance email must state that this is one 20-operator cohort across all
  referral sources.

## Weekly reconciliation

- [ ] Reconcile accepted applications against the private inbox/application system.
- [ ] Confirm the allocation and total `Accepted` values agree.
- [ ] Confirm active partner holds have a count and a future `Hold until` date.
- [ ] Confirm organization accepted + held never exceeds five.
- [ ] Confirm allocation capacities still sum to 20 after any release.
- [ ] Confirm no applicant is counted twice after activation.
- [ ] Confirm organization referrals are attributed to the correct source.
- [ ] Update outward-facing availability language if an allocation is full.
