
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InventoryItem } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AddStockMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryItems: Pick<InventoryItem, 'id' | 'name' | 'unit' | 'category'>[];
}

const AddStockMovementDialog: React.FC<AddStockMovementDialogProps> = ({
  open,
  onOpenChange,
  inventoryItems
}) => {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [movementType, setMovementType] = useState('purchase');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItemId) {
      toast({
        title: "Error",
        description: "Please select an item",
        variant: "destructive",
      });
      return;
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) === 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "Stock movement recorded",
        description: "The inventory has been updated successfully.",
      });
      
      // Reset form and close dialog
      setSelectedItemId('');
      setMovementType('purchase');
      setQuantity('');
      setReason('');
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  const selectedItem = inventoryItems.find(item => item.id === selectedItemId);

  const getQuantityLabel = () => {
    switch (movementType) {
      case 'purchase': 
        return 'Quantity Added';
      case 'sale':
        return 'Quantity Sold';
      case 'waste':
        return 'Quantity Wasted';
      case 'transfer':
        return 'Quantity Transferred';
      case 'adjustment':
        return 'Quantity Adjusted';
      default:
        return 'Quantity';
    }
  };

  const isNegativeMovement = ['sale', 'waste'].includes(movementType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="item">Item</Label>
              <Select
                value={selectedItemId}
                onValueChange={setSelectedItemId}
              >
                <SelectTrigger id="item">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="movement-type">Movement Type</Label>
              <Select
                value={movementType}
                onValueChange={setMovementType}
              >
                <SelectTrigger id="movement-type">
                  <SelectValue placeholder="Select movement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase/Receive</SelectItem>
                  <SelectItem value="sale">Sale/Usage</SelectItem>
                  <SelectItem value="waste">Waste/Spoilage</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="adjustment">Inventory Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">{getQuantityLabel()}</Label>
              <div className="flex items-center">
                <span className="mr-2">{isNegativeMovement ? '-' : '+'}</span>
                <Input
                  id="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`Enter quantity${selectedItem ? ` in ${selectedItem.unit}` : ''}`}
                  required
                />
                {selectedItem && (
                  <span className="ml-2">{selectedItem.unit}</span>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason/Notes</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason or additional notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockMovementDialog;
