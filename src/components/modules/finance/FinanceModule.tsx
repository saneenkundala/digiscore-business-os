import React, { useState } from 'react';
import {
  DollarSign,
  Receipt,
  FileSpreadsheet,
  ReceiptText,
  PieChart,
  Plus,
  Search,
  Filter,
  Download,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  Trash2,
  Eye,
  FileDown
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { Invoice, Quotation, Payment, Expense, PaymentMethod, InvoiceStatus, QuotationStatus } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { formatCurrency, formatDate, exportToCSV } from '../../../lib/utils';
import { jsPDF } from 'jspdf';

interface FinanceModuleProps {
  initialTab?: 'revenue' | 'invoices' | 'quotations' | 'payments' | 'expenses' | 'pnl';
  onNavigate: (module: string) => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  initialTab = 'revenue',
  onNavigate
}) => {
  const {
    invoices,
    quotations,
    payments,
    expenses,
    clients,
    expenseCategories,
    addInvoice,
    recordPayment,
    addExpense,
    deleteExpense,
    addQuotation
  } = useData();

  const [activeTab, setActiveTab] = useState<'revenue' | 'invoices' | 'quotations' | 'payments' | 'expenses' | 'pnl'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Modals
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddQuotationOpen, setIsAddQuotationOpen] = useState(false);

  // Forms
  const [invoiceForm, setInvoiceForm] = useState({
    client_id: clients[0]?.id || '',
    due_date: new Date(Date.now() + 86400000 * 10).toISOString().slice(0, 10),
    description: 'Monthly Retainer: Scale Acceleration Package',
    quantity: 1,
    rate: 6500,
    tax_rate: 5,
    discount: 0,
    notes: 'Standard 10 days payment term.'
  });

  const [paymentForm, setPaymentForm] = useState({
    client_id: clients[0]?.id || '',
    invoice_id: invoices[0]?.id || '',
    amount: 6500,
    payment_method: 'Bank Transfer' as PaymentMethod,
    transaction_reference: 'ENBD-TXN-' + Math.floor(100000 + Math.random() * 900000),
    notes: 'Direct wire transfer received'
  });

  const [expenseForm, setExpenseForm] = useState({
    category_id: expenseCategories[0]?.id || '',
    amount: 2500,
    vendor: 'Office Space Dubai',
    payment_method: 'Bank Transfer',
    description: 'Workspace lease installment',
    date: new Date().toISOString().slice(0, 10)
  });

  // Financial Aggregations
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalReceivables = invoices.reduce((acc, inv) => acc + inv.balance, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const staffSalaryTotal = 71500; // Total from HR team
  const officeExpensesTotal = expenses
    .filter((e) => ['Office Rent', 'Internet & Utilities'].includes(e.category_name))
    .reduce((acc, e) => acc + e.amount, 0);
  const toolsAndSoftwareTotal = expenses
    .filter((e) => e.category_name === 'Software & SaaS')
    .reduce((acc, e) => acc + e.amount, 0);

  // Invoice Save
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === invoiceForm.client_id);
    const subtotal = invoiceForm.quantity * invoiceForm.rate;
    const tax = (subtotal * invoiceForm.tax_rate) / 100;
    const total = subtotal + tax - invoiceForm.discount;

    addInvoice({
      client_id: invoiceForm.client_id,
      client_name: client?.name || 'Client',
      invoice_date: new Date().toISOString().slice(0, 10),
      due_date: invoiceForm.due_date,
      items: [
        {
          id: '1',
          description: invoiceForm.description,
          quantity: invoiceForm.quantity,
          rate: invoiceForm.rate,
          amount: subtotal
        }
      ],
      subtotal,
      discount: invoiceForm.discount,
      tax,
      total,
      paid_amount: 0,
      balance: total,
      status: 'Sent',
      notes: invoiceForm.notes
    });
    setIsAddInvoiceOpen(false);
  };

  // Payment Save
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === paymentForm.client_id);
    const invoice = invoices.find((i) => i.id === paymentForm.invoice_id);

    recordPayment({
      client_id: paymentForm.client_id,
      client_name: client?.name || 'Client',
      invoice_id: paymentForm.invoice_id || undefined,
      invoice_number: invoice?.invoice_number,
      amount: paymentForm.amount,
      payment_method: paymentForm.payment_method,
      transaction_reference: paymentForm.transaction_reference,
      payment_date: new Date().toISOString().slice(0, 10),
      notes: paymentForm.notes
    });
    setIsAddPaymentOpen(false);
  };

  // Expense Save
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = expenseCategories.find((c) => c.id === expenseForm.category_id);
    addExpense({
      category_id: expenseForm.category_id,
      category_name: cat?.name || 'General',
      amount: expenseForm.amount,
      date: expenseForm.date,
      vendor: expenseForm.vendor,
      payment_method: expenseForm.payment_method,
      description: expenseForm.description,
      added_by: 'Fatima Zahra'
    });
    setIsAddExpenseOpen(false);
  };

  // PDF Generation for Invoice
  const handleDownloadInvoicePDF = (inv: Invoice) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237); // Purple
    doc.setFontSize(22);
    doc.text('DIGI SCORE', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Digital Marketing & Branding Agency', 20, 32);
    doc.text('Downtown Dubai, UAE | contact@digiscore.agency', 20, 37);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.text(`TAX INVOICE: ${inv.invoice_number}`, 120, 25);

    doc.setFontSize(10);
    doc.text(`Date: ${formatDate(inv.invoice_date)}`, 120, 32);
    doc.text(`Due Date: ${formatDate(inv.due_date)}`, 120, 37);
    doc.text(`Status: ${inv.status.toUpperCase()}`, 120, 42);

    doc.line(20, 48, 190, 48);

    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO:', 20, 56);
    doc.setFont('helvetica', 'normal');
    doc.text(inv.client_name, 20, 62);

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(20, 72, 170, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 24, 77);
    doc.text('Qty', 115, 77);
    doc.text('Rate', 135, 77);
    doc.text('Total', 165, 77);

    // Items
    let y = 86;
    doc.setFont('helvetica', 'normal');
    inv.items.forEach((item) => {
      doc.text(item.description, 24, y);
      doc.text(item.quantity.toString(), 118, y);
      doc.text(item.rate.toLocaleString(), 135, y);
      doc.text(item.amount.toLocaleString(), 165, y);
      y += 8;
    });

    doc.line(20, y + 2, 190, y + 2);
    y += 10;
    doc.text(`Subtotal: Rs. ${inv.subtotal.toLocaleString('en-IN')}`, 135, y);
    y += 6;
    doc.text(`GST (18%): Rs. ${inv.tax.toLocaleString('en-IN')}`, 135, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Total Due: Rs. ${inv.total.toLocaleString('en-IN')}`, 135, y);

    y += 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Thank you for partnering with DIGI SCORE. All payments are non-refundable.', 20, y);

    doc.save(`${inv.invoice_number}_DIGISCORE.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-fuchsia-400" />
            Financial Operations & Cash Flow
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Invoicing engine, settlement ledger, operating expenses and Profit & Loss statement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddInvoiceOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>New Invoice</span>
          </button>
          <button
            onClick={() => setIsAddPaymentOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Record Payment</span>
          </button>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/20 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Collected Revenue</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Cleared customer payments</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Receivables</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{formatCurrency(totalReceivables)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Unpaid client invoices</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-rose-500/20 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Expenses</span>
          <p className="text-2xl font-black text-rose-400 mt-1">{formatCurrency(totalExpenses)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Operational outflows</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-purple-500/20 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Net Operating Profit</span>
          <p className="text-2xl font-black text-purple-300 mt-1">{formatCurrency(netProfit)}</p>
          <p className="text-[11px] text-emerald-400 mt-0.5">Profitable margin</p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="p-2 rounded-2xl glass-panel border border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'invoices' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Invoices ({invoices.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('quotations')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'quotations' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Quotations ({quotations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'payments' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payments Ledger ({payments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'expenses' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ReceiptText className="w-3.5 h-3.5" />
          <span>Expenses ({expenses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pnl')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'pnl' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Profit & Loss Statement</span>
        </button>
      </div>

      {/* TAB: INVOICES */}
      {activeTab === 'invoices' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Invoice #</th>
                  <th className="py-3 px-4 font-semibold">Client</th>
                  <th className="py-3 px-4 font-semibold">Issue Date</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th>
                  <th className="py-3 px-4 font-semibold text-right">Balance Due</th>
                  <th className="py-3 px-4 font-semibold text-right">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-fuchsia-300">{inv.invoice_number}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{inv.client_name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(inv.invoice_date)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(inv.due_date)}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">{formatCurrency(inv.total)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                      {formatCurrency(inv.balance)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoicePDF(inv)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-fuchsia-600/30 text-slate-300 hover:text-white transition-colors"
                        title="Generate & Download PDF"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: QUOTATIONS */}
      {activeTab === 'quotations' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Quote #</th>
                  <th className="py-3 px-4 font-semibold">Prospect / Client</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Expiry</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Quote Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-300">{q.quotation_number}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{q.client_name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(q.date)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(q.expiry_date)}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                      {formatCurrency(q.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Payment ID</th>
                  <th className="py-3 px-4 font-semibold">Client</th>
                  <th className="py-3 px-4 font-semibold">Invoice Ref</th>
                  <th className="py-3 px-4 font-semibold">Payment Method</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-300">{p.payment_number}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{p.client_name}</td>
                    <td className="py-3.5 px-4 font-mono text-fuchsia-300">{p.invoice_number || 'Direct Retainer'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                        {p.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(p.payment_date)}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{p.transaction_reference || '—'}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">
                      +{formatCurrency(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Expense ID</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Vendor</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-300">{exp.expense_number}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 font-semibold">
                        {exp.category_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">{exp.vendor}</td>
                    <td className="py-3.5 px-4 text-slate-300 truncate max-w-xs">{exp.description}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(exp.date)}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-rose-400">
                      -{formatCurrency(exp.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PROFIT & LOSS STATEMENT */}
      {activeTab === 'pnl' && (
        <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-6 max-w-4xl mx-auto shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-extrabold text-white">Agency Profit & Loss Statement (P&L)</h3>
              <p className="text-xs text-slate-400">DIGI SCORE Commercial Performance • Current Q1 2026</p>
            </div>
            <button
              onClick={() => exportToCSV('DIGISCORE_Profit_Loss', expenses)}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-4 text-sm">
            {/* Operating Income */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-white text-base bg-slate-900/80 p-2.5 rounded-xl">
                <span>1. Operating Revenue & Billing</span>
                <span className="text-emerald-400">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="pl-4 pr-2 space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Gross Retainer Billings</span>
                  <span>{formatCurrency(totalRevenue * 0.75)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Production & Media Ad Fees</span>
                  <span>{formatCurrency(totalRevenue * 0.25)}</span>
                </div>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between font-bold text-white text-base bg-slate-900/80 p-2.5 rounded-xl">
                <span>2. Operating Disbursements</span>
                <span className="text-rose-400">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="pl-4 pr-2 space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Office Rent & Infrastructure</span>
                  <span>{formatCurrency(officeExpensesTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Software, Cloud & Creative SaaS</span>
                  <span>{formatCurrency(toolsAndSoftwareTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agency Self-Marketing & Ad Spend</span>
                  <span>{formatCurrency(4500)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Studio Hardware & Lens Equipment</span>
                  <span>{formatCurrency(6800)}</span>
                </div>
              </div>
            </div>

            {/* Net Operating Profit */}
            <div className="pt-4 border-t-2 border-slate-700 flex items-center justify-between font-black text-xl p-3 rounded-xl bg-purple-950/40 border border-purple-500/30">
              <span className="text-white">NET OPERATING PROFIT</span>
              <span className={netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {formatCurrency(netProfit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      <Modal
        isOpen={isAddInvoiceOpen}
        onClose={() => setIsAddInvoiceOpen(false)}
        title="Generate Tax Invoice"
        subtitle="Issue an invoice with automated VAT and due date calculations"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Client *</label>
            <select
              value={invoiceForm.client_id}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, client_id: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Item Description</label>
            <input
              type="text"
              required
              value={invoiceForm.description}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount / Rate (₹ INR)</label>
              <input
                type="number"
                value={invoiceForm.rate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, rate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={invoiceForm.due_date}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddInvoiceOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        title="Record Client Settlement"
        subtitle="Log an incoming wire, card or cash transaction"
        maxWidth="lg"
      >
        <form onSubmit={handleSavePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Client *</label>
            <select
              value={paymentForm.client_id}
              onChange={(e) => setPaymentForm({ ...paymentForm, client_id: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹ INR) *</label>
              <input
                type="number"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
              <select
                value={paymentForm.payment_method}
                onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value as PaymentMethod })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {['Bank Transfer', 'Card', 'UPI', 'Cash', 'Online Payment'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Reference</label>
            <input
              type="text"
              value={paymentForm.transaction_reference}
              onChange={(e) => setPaymentForm({ ...paymentForm, transaction_reference: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddPaymentOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        title="Record Business Operating Expense"
        subtitle="Track overhead, rent, software and production costs"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Category *</label>
              <select
                value={expenseForm.category_id}
                onChange={(e) => setExpenseForm({ ...expenseForm, category_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹ INR) *</label>
              <input
                type="number"
                required
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Vendor / Payee</label>
            <input
              type="text"
              required
              value={expenseForm.vendor}
              onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
              placeholder="e.g. Adobe Systems / Real Estate"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Memo</label>
            <textarea
              rows={2}
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              Record Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
