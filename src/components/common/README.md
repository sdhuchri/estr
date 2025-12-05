# Reusable Components Guide

This directory contains reusable components that can be used across different pages in the application.

## Components Overview

### 1. DataTable Component

A comprehensive data table with built-in search, pagination, and actions.

#### Props:
- `data`: Array of data objects
- `columns`: Array of column definitions
- `searchable`: Enable/disable search (default: true)
- `searchFields`: Array of field names to search in
- `actions`: Array of action buttons for each row
- `onRowAction`: Callback function for row actions
- `loading`: Show loading state
- `emptyMessage`: Message when no data

#### Example Usage:
```tsx
import DataTable from "@/components/common/DataTable";

const columns = [
  {
    key: "name",
    label: "Name",
    className: "font-medium"
  },
  {
    key: "email", 
    label: "Email"
  },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span className={`px-2 py-1 rounded ${value === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
        {value}
      </span>
    )
  }
];

const actions = [
  {
    label: "Edit",
    action: "edit",
    className: "bg-blue-500 hover:bg-blue-600 text-white"
  },
  {
    label: "Delete", 
    action: "delete",
    className: "bg-red-500 hover:bg-red-600 text-white"
  }
];

<DataTable
  data={users}
  columns={columns}
  actions={actions}
  searchFields={["name", "email"]}
  onRowAction={(action, item) => {
    if (action === "edit") {
      // Handle edit
    } else if (action === "delete") {
      // Handle delete
    }
  }}
/>
```

### 2. PageHeader Component

A standardized page header with title, description, and optional action buttons.

#### Props:
- `title`: Page title (required)
- `description`: Optional description text
- `children`: Optional action buttons or other elements
- `className`: Additional CSS classes

#### Example Usage:
```tsx
import PageHeader from "@/components/common/PageHeader";

<PageHeader
  title="User Management"
  description="Manage system users and permissions"
>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Add User
  </button>
</PageHeader>
```

### 3. Modal Component

A flexible modal component with header, scrollable content, and footer.

#### Props:
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close modal
- `title`: Modal title
- `children`: Modal content
- `footer`: Optional footer content
- `size`: Modal size ("sm", "md", "lg", "xl", "2xl", "4xl")
- `headerClassName`: Additional header classes
- `contentClassName`: Additional content classes
- `footerClassName`: Additional footer classes

#### Example Usage:
```tsx
import Modal from "@/components/common/Modal";

const modalFooter = (
  <>
    <button onClick={onClose}>Cancel</button>
    <button onClick={onSave}>Save</button>
  </>
);

<Modal
  isOpen={isModalOpen}
  onClose={handleClose}
  title="Edit User"
  footer={modalFooter}
  size="lg"
>
  <div>Modal content here</div>
</Modal>
```

### 4. FormField Components

Form field components with consistent styling and validation support.

#### FormField Props:
- `label`: Field label (required)
- `children`: Form input element
- `required`: Show required indicator
- `error`: Error message to display
- `className`: Additional CSS classes
- `labelClassName`: Additional label classes

#### Input Props:
- All standard HTML input props
- `error`: Boolean to show error state

#### Select Props:
- All standard HTML select props
- `options`: Array of {value, label} objects
- `error`: Boolean to show error state

#### Textarea Props:
- All standard HTML textarea props
- `error`: Boolean to show error state

#### Example Usage:
```tsx
import FormField, { Input, Select, Textarea } from "@/components/common/FormField";

<FormField label="Name" required error={errors.name}>
  <Input
    value={formData.name}
    onChange={(e) => setFormData({...formData, name: e.target.value})}
    error={!!errors.name}
  />
</FormField>

<FormField label="Status">
  <Select
    value={formData.status}
    onChange={(e) => setFormData({...formData, status: e.target.value})}
    options={[
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]}
  />
</FormField>

<FormField label="Description">
  <Textarea
    value={formData.description}
    onChange={(e) => setFormData({...formData, description: e.target.value})}
    rows={4}
  />
</FormField>
```

## Complete Page Example

Here's how to use all components together in a typical CRUD page:

```tsx
"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/components/common/DataTable";
import PageHeader from "@/components/common/PageHeader";
import Modal from "@/components/common/Modal";
import FormField, { Input, Select } from "@/components/common/FormField";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define columns
  const columns = [
    {
      key: "id",
      label: "ID",
      className: "text-center"
    },
    {
      key: "name",
      label: "Name",
      className: "font-medium"
    },
    {
      key: "email",
      label: "Email"
    },
    {
      key: "role",
      label: "Role"
    }
  ];

  // Define actions
  const actions = [
    {
      label: "Edit",
      action: "edit",
      className: "bg-blue-500 hover:bg-blue-600 text-white"
    },
    {
      label: "Delete",
      action: "delete",
      className: "bg-red-500 hover:bg-red-600 text-white"
    }
  ];

  const handleRowAction = (action, item) => {
    if (action === "edit") {
      setSelectedItem(item);
      setIsModalOpen(true);
    } else if (action === "delete") {
      // Handle delete
    }
  };

  const addButton = (
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Add User
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Users"
        description="Manage system users"
      >
        {addButton}
      </PageHeader>

      <DataTable
        data={data}
        columns={columns}
        actions={actions}
        searchFields={["name", "email"]}
        onRowAction={handleRowAction}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? "Edit User" : "Add User"}
        size="lg"
      >
        <div className="space-y-4">
          <FormField label="Name" required>
            <Input placeholder="Enter name" />
          </FormField>
          <FormField label="Email" required>
            <Input type="email" placeholder="Enter email" />
          </FormField>
          <FormField label="Role">
            <Select
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" }
              ]}
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
```

## Benefits

1. **Consistency**: All pages use the same UI patterns
2. **Maintainability**: Changes to components affect all pages
3. **Development Speed**: Faster page creation with pre-built components
4. **Accessibility**: Built-in accessibility features
5. **Responsive**: Mobile-friendly by default
6. **Customizable**: Flexible props for different use cases

## Styling

All components use Tailwind CSS classes and follow the application's design system with the primary color `#161950` for consistency.