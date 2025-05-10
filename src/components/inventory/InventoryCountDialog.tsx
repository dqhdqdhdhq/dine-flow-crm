
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { InventoryItem } from '@/types';
import { toast } from '@/hooks/use-toast';

interface InventoryCountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryItems: InventoryItem[];
}

type CountItem = {
  id: string;
  name: string;
  unit: string;
  currentCount: string;
  expectedCount: number;
  isCounted: boolean;
  variance?: number;
  varianceValue?: number;
  notes?: string;
};

const InventoryCountDialog: React.FC<InventoryCountDialogProps> = ({
  open,
  onOpenChange,
  inventoryItems
}) => {
  const [activeTab, setActiveTab] = useState('counting');
  const [countName, setCountName] = useState('Full Inventory Count');
  const [countItems, setCountItems] = useState<CountItem[]>(
    inventoryItems.map(item => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      currentCount: '',
      expectedCount: item.currentStock || 0,
      isCounted: false
    }))
  );
  const [filter, setFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter items based on search input
  const filteredItems = countItems.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Sort items: uncounted first, then alphabetically
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.isCounted && !b.isCounted) return 1;
    if (!a.isCounted && b.isCounted) return -1;
    return a.name.localeCompare(b.name);
  });

  const handleCountChange = (id: string, value: string) => {
    setCountItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const numValue = value === '' ? '' : Number(value);
          const isCounted = value !== '';
          
          // Calculate variance if we have a valid number
          let variance: number | undefined;
          let varianceValue: number | undefined;
          
          if (value !== '') {
            variance = Number(value) - item.expectedCount;
            varianceValue = variance * (inventoryItems.find(invItem => invItem.id === id)?.unitCost || 0);
          }
          
          return {
            ...item,
            currentCount: value,
            isCounted,
            variance,
            varianceValue
          };
        }
        return item;
      })
    );
  };

  const handleNotesChange = (id: string, notes: string) => {
    setCountItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  const handleSubmitCount = () => {
    const uncountedItems = countItems.filter(item => !item.isCounted);
    
    if (uncountedItems.length > 0) {
      const confirmSubmit = window.confirm(
        `There are ${uncountedItems.length} items that haven't been counted. Do you want to continue anyway?`
      );
      
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    
    // In a real app, this would be an API call to save the inventory count
    setTimeout(() => {
      // Move to review tab to show results
      setActiveTab('review');
      setIsSubmitting(false);
      
      toast({
        title: "Inventory count completed",
        description: "Your count has been saved successfully.",
      });
    }, 1500);
  };

  const handleComplete = () => {
    onOpenChange(false);
    toast({
      title: "Inventory count finalized",
      description: "The inventory has been updated based on your count.",
    });
  };

  const countedItemsCount = countItems.filter(item => item.isCounted).length;
  const totalItemsCount = countItems.length;
  const countProgress = totalItemsCount > 0 
    ? Math.round((countedItemsCount / totalItemsCount) * 100) 
    : 0;

  const totalPositiveVariance = countItems
    .filter(item => item.variance && item.variance > 0 && item.varianceValue)
    .reduce((sum, item) => sum + (item.varianceValue || 0), 0);
    
  const totalNegativeVariance = countItems
    .filter(item => item.variance && item.variance < 0 && item.varianceValue)
    .reduce((sum, item) => sum + (item.varianceValue || 0), 0);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing if we're not in the middle of counting
      if (!newOpen && activeTab === 'counting' && countedItemsCount > 0) {
        const confirm = window.confirm('You have unsaved count data. Are you sure you want to close?');
        if (!confirm) return;
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Inventory Count</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="counting">Counting</TabsTrigger>
              <TabsTrigger value="review" disabled={countedItemsCount === 0}>Review</TabsTrigger>
            </TabsList>
            
            <div className="text-sm">
              Progress: <Badge variant="outline">{countProgress}%</Badge> 
              <span className="ml-2">({countedItemsCount}/{totalItemsCount})</span>
            </div>
          </div>
          
          <TabsContent value="counting" className="flex-1 overflow-hidden flex flex-col">
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="count-name">Count Name</Label>
                <Input 
                  id="count-name"
                  value={countName}
                  onChange={(e) => setCountName(e.target.value)}
                  placeholder="Enter count name"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="filter">Filter Items</Label>
                <Input
                  id="filter"
                  type="search"
                  placeholder="Search items..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border rounded-md flex-1 overflow-hidden flex flex-col">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Item</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead className="w-[30%]">Actual Count</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              
              <div className="overflow-y-auto flex-1">
                <Table>
                  <TableBody>
                    {sortedItems.length > 0 ? (
                      sortedItems.map((item) => (
                        <TableRow key={item.id} className={item.isCounted ? "bg-muted/20" : ""}>
                          <TableCell>
                            <div className="font-medium">{item.name}</div>
                          </TableCell>
                          <TableCell>
                            {item.expectedCount} {item.unit}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.currentCount}
                                onChange={(e) => handleCountChange(item.id, e.target.value)}
                                className="w-24 mr-2"
                              />
                              <span>{item.unit}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="review" className="flex-1 overflow-hidden flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-muted/20 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Total Items Counted</div>
                <div className="text-2xl font-bold">{countedItemsCount}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Negative Variance</div>
                <div className="text-2xl font-bold text-destructive">
                  ${Math.abs(totalNegativeVariance).toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Positive Variance</div>
                <div className="text-2xl font-bold text-success">
                  ${totalPositiveVariance.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="border rounded-md flex-1 overflow-hidden flex flex-col">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-[30%]">Notes</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              
              <div className="overflow-y-auto flex-1">
                <Table>
                  <TableBody>
                    {countItems.filter(item => item.isCounted).map((item) => {
                      const varianceClass = item.variance === 0
                        ? ""
                        : item.variance && item.variance < 0
                          ? "text-destructive"
                          : "text-success";
                          
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.expectedCount} {item.unit}</TableCell>
                          <TableCell>{item.currentCount} {item.unit}</TableCell>
                          <TableCell className={varianceClass}>
                            {item.variance !== undefined && (
                              <>
                                {item.variance > 0 ? '+' : ''}{item.variance} {item.unit}
                              </>
                            )}
                          </TableCell>
                          <TableCell className={varianceClass}>
                            {item.varianceValue !== undefined && (
                              <>
                                {item.varianceValue > 0 ? '+' : ''}${item.varianceValue.toFixed(2)}
                              </>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.notes || ''}
                              onChange={(e) => handleNotesChange(item.id, e.target.value)}
                              placeholder="Add notes about variance..."
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {activeTab === 'counting' ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitCount}
                disabled={countedItemsCount === 0 || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Complete Count'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('counting')}
              >
                Back to Counting
              </Button>
              <Button onClick={handleComplete}>
                Finalize & Update Inventory
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryCountDialog;
