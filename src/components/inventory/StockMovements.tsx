
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { StockMovement, InventoryItem } from '@/types';
import AddStockMovementDialog from './AddStockMovementDialog';

// Mock stock movement data
const mockStockMovements: StockMovement[] = [
  {
    id: 'mov-001',
    inventoryItemId: '1',
    type: 'purchase',
    quantity: 5,
    previousQuantity: 7,
    newQuantity: 12,
    performedBy: 'user-001',
    createdAt: '2025-05-05T14:30:00Z'
  },
  {
    id: 'mov-002',
    inventoryItemId: '3',
    type: 'sale',
    quantity: -2,
    previousQuantity: 5,
    newQuantity: 3,
    performedBy: 'user-001',
    createdAt: '2025-05-05T15:45:00Z'
  },
  {
    id: 'mov-003',
    inventoryItemId: '2',
    type: 'waste',
    quantity: -1,
    previousQuantity: 25,
    newQuantity: 24,
    reason: 'Bottle broken during service',
    performedBy: 'user-002',
    createdAt: '2025-05-04T20:15:00Z'
  },
  {
    id: 'mov-004',
    inventoryItemId: '4',
    type: 'adjustment',
    quantity: 2,
    previousQuantity: 6,
    newQuantity: 8,
    reason: 'Inventory count correction',
    performedBy: 'user-001',
    createdAt: '2025-05-03T11:00:00Z'
  }
];

// Mock inventory items for reference
const mockInventoryItems: Record<string, Pick<InventoryItem, 'id' | 'name' | 'unit' | 'category'>> = {
  '1': { id: '1', name: 'Parmigiano Reggiano', unit: 'kg', category: 'Cheese' },
  '2': { id: '2', name: 'Cabernet Sauvignon', unit: 'bottle', category: 'Wine' },
  '3': { id: '3', name: 'Truffle Oil', unit: 'bottle', category: 'Oil' },
  '4': { id: '4', name: 'Ribeye Steak', unit: 'kg', category: 'Meat' }
};

// Mock users for reference
const mockUsers: Record<string, { id: string; name: string }> = {
  'user-001': { id: 'user-001', name: 'John Smith' },
  'user-002': { id: 'user-002', name: 'Sarah Davis' }
};

interface StockMovementsProps {
  searchQuery?: string;
}

const StockMovements: React.FC<StockMovementsProps> = ({ searchQuery = '' }) => {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false);
  
  // Filter stock movements based on search query and filters
  const filteredMovements = mockStockMovements
    .filter(movement => {
      const item = mockInventoryItems[movement.inventoryItemId];
      if (!item) return false;
      
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movement.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;
      
      const matchesType = typeFilter ? movement.type === typeFilter : true;
      
      const matchesDate = 
        dateFilter === 'today' ? new Date(movement.createdAt).toDateString() === new Date().toDateString() :
        dateFilter === 'yesterday' ? new Date(movement.createdAt).toDateString() === new Date(Date.now() - 86400000).toDateString() :
        dateFilter === 'thisWeek' ? new Date(movement.createdAt) > new Date(Date.now() - 7 * 86400000) :
        true;
      
      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by most recent

  const getMovementBadgeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'success';
      case 'sale': return 'default';
      case 'waste': return 'destructive';
      case 'transfer': return 'secondary';
      case 'adjustment': return 'warning';
      case 'count': return 'outline';
      default: return 'default';
    }
  };

  const formatMovementType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Stock Movements</CardTitle>
          <Button onClick={() => setIsAddMovementOpen(true)}>Record Movement</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 md:items-end mb-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="type-filter">Movement Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="waste">Waste</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex-1">
              <Label htmlFor="date-filter">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger id="date-filter">
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setTypeFilter('');
                setDateFilter('');
              }}
              className="md:mb-0"
            >
              Reset Filters
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="hidden md:table-cell">Change</TableHead>
                  <TableHead className="hidden md:table-cell">Reason</TableHead>
                  <TableHead className="hidden md:table-cell">Performed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.length > 0 ? (
                  filteredMovements.map((movement) => {
                    const item = mockInventoryItems[movement.inventoryItemId];
                    const user = mockUsers[movement.performedBy];
                    
                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {formatDate(movement.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item?.name}</div>
                          <div className="text-xs text-muted-foreground">{item?.category}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getMovementBadgeColor(movement.type)}>
                            {formatMovementType(movement.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={movement.quantity < 0 ? 'text-destructive' : 'text-success'}>
                            {movement.quantity > 0 ? '+' : ''}{movement.quantity} {item?.unit}
                          </span>
                          <div className="md:hidden text-xs text-muted-foreground">
                            {movement.previousQuantity} → {movement.newQuantity} {item?.unit}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {movement.previousQuantity} → {movement.newQuantity} {item?.unit}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {movement.reason || '-'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user?.name || 'Unknown'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No stock movements found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <AddStockMovementDialog 
        open={isAddMovementOpen}
        onOpenChange={setIsAddMovementOpen}
        inventoryItems={Object.values(mockInventoryItems)}
      />
    </>
  );
};

export default StockMovements;
