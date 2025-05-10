
import React, { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical, Eye, Edit, BarChart } from 'lucide-react';
import { InventoryItem } from '@/types';
import ItemDetailsDialog from './ItemDetailsDialog';

// Enhanced mock data for demonstration
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Parmigiano Reggiano',
    description: 'Aged 24 months, imported from Italy',
    sku: 'PR-24-001',
    category: 'Cheese',
    subcategory: 'Hard Cheese',
    unit: 'kg',
    unitCost: 28.5,
    quantityOnHand: 12,
    reorderPoint: 5,
    reorderQuantity: 10,
    supplierId: 'supplier-1',
    notes: 'Premium quality',
    defaultSupplierId: 'supplier-1',
    defaultSupplierName: 'Italian Imports Co.',
    cost: 28.5,
    currentStock: 12,
    lowStockThreshold: 5,
    storageLocation: 'Walk-in Cooler',
    expirationDate: '2025-08-15',
    lotNumber: 'IT2024-05',
    imageUrl: '/placeholder.svg',
    markupPercentage: 40,
    lastCountDate: '2025-05-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Cabernet Sauvignon',
    description: 'Vintage 2018, Napa Valley',
    sku: 'CS-18-002',
    category: 'Wine',
    subcategory: 'Red Wine',
    unit: 'bottle',
    unitCost: 35.0,
    quantityOnHand: 24,
    reorderPoint: 10,
    reorderQuantity: 12,
    supplierId: 'supplier-2',
    notes: 'High demand item',
    defaultSupplierId: 'supplier-2',
    defaultSupplierName: 'Premium Wines',
    cost: 35.0,
    currentStock: 24,
    lowStockThreshold: 10,
    storageLocation: 'Wine Cellar',
    expirationDate: '2028-12-31',
    lotNumber: 'NV2018-10',
    imageUrl: '/placeholder.svg',
    markupPercentage: 60,
    menuItems: ['Wine Pairing Menu', 'Chef\'s Selection'],
    lastCountDate: '2025-05-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Truffle Oil',
    description: 'White truffle infused olive oil',
    sku: 'TO-WH-003',
    category: 'Oil',
    subcategory: 'Specialty Oil',
    unit: 'bottle',
    unitCost: 18.75,
    quantityOnHand: 3,
    reorderPoint: 5,
    reorderQuantity: 8,
    supplierId: 'supplier-1',
    notes: 'Specialty item',
    defaultSupplierId: 'supplier-1',
    defaultSupplierName: 'Italian Imports Co.',
    cost: 18.75,
    currentStock: 3,
    lowStockThreshold: 5,
    storageLocation: 'Dry Storage',
    expirationDate: '2025-10-15',
    lotNumber: 'TR2024-02',
    imageUrl: '/placeholder.svg',
    markupPercentage: 50,
    menuItems: ['Truffle Pasta', 'Risotto'],
    lastCountDate: '2025-05-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Ribeye Steak',
    description: 'Prime grade, 30-day aged',
    sku: 'RB-PR-004',
    category: 'Meat',
    subcategory: 'Beef',
    unit: 'kg',
    unitCost: 42.0,
    quantityOnHand: 8,
    reorderPoint: 4,
    reorderQuantity: 6,
    supplierId: 'supplier-3',
    notes: 'Keep frozen until use',
    defaultSupplierId: 'supplier-3',
    defaultSupplierName: 'Premium Meats',
    cost: 42.0,
    currentStock: 8,
    lowStockThreshold: 4,
    storageLocation: 'Freezer',
    expirationDate: '2025-06-10',
    lotNumber: 'BF2024-15',
    imageUrl: '/placeholder.svg',
    markupPercentage: 45,
    menuItems: ['Steak Dinner', 'Surf and Turf'],
    lastCountDate: '2025-05-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Extracted unique categories and locations for filters
const uniqueCategories = [...new Set(mockInventoryItems.map(item => item.category))];
const uniqueLocations = [...new Set(mockInventoryItems.map(item => item.storageLocation).filter(Boolean))];

interface InventoryItemsProps {
  searchQuery: string;
}

const InventoryItems: React.FC<InventoryItemsProps> = ({ searchQuery }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Enhanced filtering logic
  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.defaultSupplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subcategory?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    
    const matchesLocation = locationFilter ? item.storageLocation === locationFilter : true;
    
    const matchesStockFilter = 
      stockFilter === 'low' ? (item.currentStock || 0) <= (item.lowStockThreshold || 0) :
      stockFilter === 'out' ? (item.currentStock || 0) === 0 :
      stockFilter === 'expiring-soon' ? 
        (item.expirationDate && new Date(item.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) : 
        true;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesStockFilter;
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { label: 'Out of stock', color: 'destructive' };
    } else if (item.currentStock && item.lowStockThreshold && item.currentStock <= item.lowStockThreshold) {
      return { label: 'Low stock', color: 'warning' };
    } else {
      return { label: 'In stock', color: 'success' };
    }
  };

  const handleItemDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDetailsDialogOpen(true);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Advanced Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location-filter">Storage Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock-filter">Stock Status</Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger id="stock-filter">
                  <SelectValue placeholder="All Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCategoryFilter('');
                  setLocationFilter('');
                  setStockFilter('');
                }}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="hidden md:table-cell">SKU</TableHead>
                <TableHead className="hidden md:table-cell">Unit</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {item.description}
                        </div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          SKU: {item.sku}
                        </div>
                      </TableCell>
                      <TableCell>{item.storageLocation || 'Not specified'}</TableCell>
                      <TableCell>{item.defaultSupplierName}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.sku}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.unit}</TableCell>
                      <TableCell>${item.cost?.toFixed(2)}</TableCell>
                      <TableCell>{item.currentStock} {item.unit}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color as "default" | "secondary" | "destructive" | "outline" | "success" | "warning"}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleItemDetails(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart className="mr-2 h-4 w-4" />
                              Usage History
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No inventory items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedItem && (
        <ItemDetailsDialog
          item={selectedItem}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        />
      )}
    </>
  );
};

export default InventoryItems;
