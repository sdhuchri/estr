# Menu Migration - Dynamic Menu Implementation

## Perubahan

Menu sidebar telah diubah dari **hardcoded** menjadi **dynamic** dengan fetch dari API.

## File yang Diubah

### `src/layout/AppSidebar.tsx`
- Menghapus hardcoded menu items
- Menambahkan state `navItems` dan `isLoading`
- Menambahkan `useEffect` untuk fetch menu dari API
- Menambahkan helper functions untuk icon mapping:
  - `getIconByName()` - untuk parent menu icons
  - `getSubIconByName()` - untuk submenu icons
- Menambahkan loading spinner saat fetch data

## API Response Format

```json
[
  {
    "Icon": null,
    "Id": 754,
    "MenuId": 754,
    "MenuOrder": 2,
    "ParentID": 0,
    "Profile": "estr_opr_cab",
    "UserId": "estr1",
    "aplikasi": "00012",
    "name": "Manual Cabang",
    "path": "#",
    "status_menu": 1,
    "status_role": 1,
    "status_user_menu": 1,
    "subItems": [
      {
        "Icon": null,
        "Id": 760,
        "MenuId": 760,
        "MenuOrder": 1,
        "ParentID": 754,
        "Profile": "estr_opr_cab",
        "UserId": "estr1",
        "aplikasi": "00012",
        "name": "To Do List",
        "path": "/manual-cabang/to-do-list",
        "status_menu": 1,
        "status_role": 1,
        "status_user_menu": 1
      }
    ]
  }
]
```

## Icon Mapping

### Parent Menu Icons
- Manual Cabang → `<FileText />`
- List Reject → `<FileText />`
- BI-Fast Transaction → `<Grid />`
- Setting → `<Logs />`
- Laporan → `<FileStack />`
- Manual Kep → `<BadgeCheck />`

### Submenu Icons
- To Do List → `<List />`
- Tracking → `<FileStack />`
- Input Manual → `<SquarePlus />`
- Input → `<SquarePlus />`
- Edit → `<FileText />`
- Operator → `<UserCircle />`
- Status → `<CircleCheckBig />`
- Laporan Aktivitas → `<FileStack />`
- dll.

## Cara Kerja

1. Component mount → fetch userId dari cookies
2. Call `getUserMenu(userId)` API
3. Transform response ke format `NavItem[]`
4. Set state `navItems` dengan data yang sudah ditransform
5. Render menu berdasarkan data dari API

## Dependencies

- `js-cookie` - untuk get userId dari cookies
- `src/services/authService.ts` - service untuk fetch menu

## Testing

Untuk testing, pastikan:
1. User sudah login dan memiliki userId di cookies
2. API endpoint `/api/auth/usermenu` berjalan dengan baik
3. Response API sesuai dengan format yang diharapkan

## Error Handling

- Jika userId tidak ada, menu tidak akan di-fetch
- Jika API error, akan log error ke console dan set loading false
- Loading spinner ditampilkan saat fetch data
