import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { fetchUser, fetchUsers } from '@/lib/prisma'
import { columns } from './columns'
import { DataTable } from './data-table'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

const UsersPage = async () => {
  const user = await fetchUser()

  if (!user || user.role !== 'admin') {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Unauthorized Access</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to view this page. This area is restricted to administrators only.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const users = await fetchUsers(user)

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Users</CardTitle>
        <CardDescription className="text-gray-500">
          Manage user accounts and view their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={users} />
      </CardContent>
    </Card>
  )
}

export default UsersPage