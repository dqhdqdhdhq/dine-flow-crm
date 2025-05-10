
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  FileText, 
  Package, 
  Users, 
  BarChart, 
  ClipboardList 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import InventoryItems from '@/components/inventory/InventoryItems';
import PurchaseOrders from '@/components/inventory/PurchaseOrders';
import Suppliers from '@/components/inventory/Suppliers';
import StockMovements from '@/components/inventory/StockMovements';
import InventoryCountDialog from '@/components/inventory/InventoryCountDialog';
import AddItemDialog from '@/components/inventory/AddItemDialog';
import { mockInventoryItems } from '@/components/inventory/mockInventoryData';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('items');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isInventoryCountDialogOpen, setIsInventoryCountDialogOpen] = useState(false);

  const handleNewItem = () => {
    setIsAddItemDialogOpen(true);
  };

  const handleNewPurchaseOrder = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available in a future update.",
    });
  };

  const handleNewSupplier = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available in a future update.",
    });
  };

  const handleStartInventoryCount = () => {
    setIsInventoryCountDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Inventory & Supplies</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={handleNewItem}>
            <Plus className="h-4 w-4" />
            New Item
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleNewPurchaseOrder}>
            <FileText className="h-4 w-4" />
            New Purchase Order
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleNewSupplier}>
            <Users className="h-4 w-4" />
            New Supplier
          </Button>
          <Button variant="default" className="gap-2" onClick={handleStartInventoryCount}>
            <ClipboardList className="h-4 w-4" />
            Start Inventory Count
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory, orders, suppliers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="items">
            <Package className="mr-2 h-4 w-4" />
            Inventory Items
          </TabsTrigger>
          <TabsTrigger value="movements">
            <BarChart className="mr-2 h-4 w-4" />
            Stock Movements
          </TabsTrigger>
          <TabsTrigger value="orders">
            <FileText className="mr-2 h-4 w-4" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="suppliers">
            <Users className="mr-2 h-4 w-4" />
            Suppliers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <InventoryItems searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="movements">
          <StockMovements searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="orders">
          <PurchaseOrders searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="suppliers">
          <Suppliers searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>

      <InventoryCountDialog 
        open={isInventoryCountDialogOpen} 
        onOpenChange={setIsInventoryCountDialogOpen} 
        inventoryItems={mockInventoryItems}
      />

      <AddItemDialog
        open={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
      />
    </div>
  );
};

export default Inventory;
