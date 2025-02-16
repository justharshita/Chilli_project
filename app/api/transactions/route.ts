import { NextResponse } from 'next/server';

// In-memory storage for transactions
let transactions: any[] = [];

// Helper function to get company email from the request headers
const getCompanyEmail = (req: Request) => {
  const companyInfo = req.headers.get('x-company-info');
  if (!companyInfo) return null;
  
  try {
    const { email } = JSON.parse(companyInfo);
    return email;
  } catch {
    return null;
  }
};

export async function GET(req: Request) {
  try {
    const companyEmail = getCompanyEmail(req);
    if (!companyEmail) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Filter transactions for this company
    const companyTransactions = transactions.filter(t => t.company_email === companyEmail);

    // Calculate summary statistics
    const summary = {
      totalRevenue: companyTransactions.reduce((sum, t) => sum + (t.sale_value || 0), 0),
      totalProfit: companyTransactions.reduce((sum, t) => sum + ((t.sale_value || 0) - (t.purchase_price || 0)), 0),
      totalTransactions: companyTransactions.length,
      averageOrderValue: companyTransactions.length ? 
        companyTransactions.reduce((sum, t) => sum + (t.sale_value || 0), 0) / companyTransactions.length : 0,
    };

    return NextResponse.json({ 
      success: true,
      data: {
        transactions: companyTransactions,
        summary
      }
    });

  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const companyEmail = getCompanyEmail(req);
    if (!companyEmail) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'transactionDate',
      'salesPoc',
      'productType',
      'clientName',
      'clientEmail',
      'purchasePrice',
      'saleValue',
      'deliveryDate',
      'deliveryAddress'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Create new transaction
    const newTransaction = {
      id: Date.now().toString(),
      transaction_date: body.transactionDate,
      sales_poc: body.salesPoc,
      product_type: body.productType,
      client_name: body.clientName,
      client_email: body.clientEmail,
      purchase_price: body.purchasePrice,
      sale_value: body.saleValue,
      delivery_date: body.deliveryDate,
      delivery_address: body.deliveryAddress,
      supplier_terms: body.supplierTerms || '',
      client_terms: body.clientTerms || '',
      remarks: body.remarks || '',
      created_at: new Date().toISOString(),
      company_email: companyEmail
    };

    // Add to in-memory storage
    transactions.push(newTransaction);

    return NextResponse.json({ 
      success: true, 
      message: 'Transaction added successfully',
      data: newTransaction
    });

  } catch (error: any) {
    console.error('Failed to add transaction:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to add transaction'
      },
      { status: 500 }
    );
  }
} 