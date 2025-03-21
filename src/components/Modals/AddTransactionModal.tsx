
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionType, Category } from "@/lib/types";
import { useFinanceStore, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/store";
import CategoryIcon from "@/components/UI/CategoryIcon";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = "expense",
}) => {
  const { toast } = useToast();
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const accounts = useFinanceStore((state) => state.accounts);
  
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<Category>("food");
  const [account, setAccount] = useState<string>(accounts[0]?.name || "");

  // Update type when defaultType changes
  useEffect(() => {
    setType(defaultType);
    // Reset category based on type
    if (defaultType === "expense") {
      setCategory("food" as Category);
    } else {
      setCategory("salary" as Category);
    }
  }, [defaultType]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setDescription("");
      if (type === "expense") {
        setCategory("food" as Category);
      } else {
        setCategory("salary" as Category);
      }
    }
  }, [isOpen, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide.",
        variant: "destructive",
      });
      return;
    }
    
    if (!account) {
      toast({
        title: "Compte requis",
        description: "Veuillez sélectionner un compte.",
        variant: "destructive",
      });
      return;
    }
    
    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(),
      account,
    });
    
    toast({
      title: type === "expense" ? "Dépense ajoutée" : "Revenu ajouté",
      description: `${description || category} pour ${amount} €`,
    });
    
    onClose();
  };

  const categoryList = type === "expense" 
    ? Object.entries(EXPENSE_CATEGORIES) 
    : Object.entries(INCOME_CATEGORIES);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {type === "expense" ? "Ajouter une dépense" : "Ajouter un revenu"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Transaction Type Toggle */}
          <div className="flex rounded-lg overflow-hidden border">
            <button
              type="button"
              className={`flex-1 py-3 px-4 text-center transition-colors ${
                type === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setType("expense")}
            >
              Dépense
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-4 text-center transition-colors ${
                type === "income"
                  ? "bg-green-500 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setType("income")}
            >
              Revenu
            </button>
          </div>
          
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg"
                placeholder="0.00"
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                €
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnelle)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la transaction"
            />
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <div className="grid grid-cols-4 gap-2">
              {categoryList.map(([key, { name, icon }]) => (
                <button
                  key={key}
                  type="button"
                  className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                    category === key
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => setCategory(key as Category)}
                >
                  <CategoryIcon category={key as Category} size={24} />
                  <span className="text-xs mt-1 text-center">{name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Account */}
          <div className="space-y-2">
            <Label>Compte</Label>
            <div className="flex flex-wrap gap-2">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    account === acc.name
                      ? "bg-primary/10 border border-primary/30"
                      : "border border-border hover:bg-secondary"
                  }`}
                  onClick={() => setAccount(acc.name)}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: acc.color }}
                  ></span>
                  <span>{acc.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="gap-1"
            >
              <X size={16} /> Annuler
            </Button>
            <Button type="submit" className="gap-1">
              <Check size={16} /> Sauvegarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
