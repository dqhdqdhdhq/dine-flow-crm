
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InventoryItem } from '@/types';
import { format } from 'date-fns';

interface ItemDetailsDialogProps {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ItemDetailsDialog: React.FC<ItemDetailsDialogProps> = ({ 
  item, 
  open, 
  onOpenChange 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStockStatus = () => {
    if (item.currentStock === 0) {
      return <Badge variant="destructive">Out of stock</Badge>;
    } else if (item.currentStock && item.lowStockThreshold && item.currentStock <= item.lowStockThreshold) {
      return <Badge variant="warning">Low stock</Badge>;
    } else {
      return <Badge variant="success">In stock</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {item.name} {getStockStatus()}
          </DialogTitle>
          <DialogDescription className="text-md">{item.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {item.imageUrl && (
              <div className="mb-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="rounded-md object-cover h-64 w-full border"
                />
              </div>
            )}

            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Basic Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">SKU:</div>
                  <div>{item.sku}</div>
                  <div className="text-muted-foreground">Category:</div>
                  <div>{item.category}</div>
                  <div className="text-muted-foreground">Subcategory:</div>
                  <div>{item.subcategory || 'Not specified'}</div>
                  <div className="text-muted-foreground">Unit:</div>
                  <div>{item.unit}</div>
                  <div className="text-muted-foreground">Storage Location:</div>
                  <div>{item.storageLocation || 'Not specified'}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">Supplier Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Default Supplier:</div>
                  <div>{item.defaultSupplierName || 'Not specified'}</div>
                  <div className="text-muted-foreground">Supplier ID:</div>
                  <div>{item.supplierId}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-medium">Inventory Status</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Current Stock:</div>
                <div>{item.currentStock} {item.unit}</div>
                <div className="text-muted-foreground">Reorder Point:</div>
                <div>{item.reorderPoint} {item.unit}</div>
                <div className="text-muted-foreground">Reorder Quantity:</div>
                <div>{item.reorderQuantity} {item.unit}</div>
                <div className="text-muted-foreground">Last Count Date:</div>
                <div>{formatDate(item.lastCountDate)}</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Cost & Pricing</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Unit Cost:</div>
                <div>${item.unitCost.toFixed(2)}</div>
                <div className="text-muted-foreground">Markup:</div>
                <div>{item.markupPercentage ? `${item.markupPercentage}%` : 'Not specified'}</div>
                <div className="text-muted-foreground">Total Value:</div>
                <div>${(item.unitCost * (item.currentStock || 0)).toFixed(2)}</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Additional Information</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Expiration Date:</div>
                <div>{formatDate(item.expirationDate)}</div>
                <div className="text-muted-foreground">Lot Number:</div>
                <div>{item.lotNumber || 'Not specified'}</div>
              </div>
            </div>

            {item.notes && (
              <div>
                <h3 className="font-medium">Notes</h3>
                <Separator className="my-2" />
                <p className="text-sm">{item.notes}</p>
              </div>
            )}

            {item.menuItems && item.menuItems.length > 0 && (
              <div>
                <h3 className="font-medium">Used In Menu Items</h3>
                <Separator className="my-2" />
                <div className="flex flex-wrap gap-2">
                  {item.menuItems.map((menuItem, index) => (
                    <Badge key={index} variant="outline">{menuItem}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="text-sm text-muted-foreground">
            Last updated: {formatDate(item.updatedAt)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button>Edit Item</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailsDialog;
