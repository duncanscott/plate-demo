'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { DataEditor, GridCellKind, GridColumn, Item, EditableGridCell } from '@glideapps/glide-data-grid';
import '@glideapps/glide-data-grid/dist/index.css';
import { useTools } from "@/components/layout/ToolsContext";
import * as XLSX from 'xlsx';

// Dynamic cell data type
type CellValue = string | number | boolean | null;

// Dynamic row structure
interface DynamicRow {
  [key: string]: CellValue;
}

// Sample data
const sampleData: DynamicRow[] = [
  { 'ID': '1', 'Name': 'John Doe', 'Email': 'john@example.com', 'Department': 'Engineering', 'Salary': 85000, 'Start Date': '2022-01-15', 'Active': true },
  { 'ID': '2', 'Name': 'Jane Smith', 'Email': 'jane@example.com', 'Department': 'Marketing', 'Salary': 72000, 'Start Date': '2021-08-20', 'Active': true },
  { 'ID': '3', 'Name': 'Bob Johnson', 'Email': 'bob@example.com', 'Department': 'Sales', 'Salary': 68000, 'Start Date': '2023-03-10', 'Active': false },
  { 'ID': '4', 'Name': 'Alice Brown', 'Email': 'alice@example.com', 'Department': 'Engineering', 'Salary': 92000, 'Start Date': '2020-11-05', 'Active': true },
  { 'ID': '5', 'Name': 'Charlie Davis', 'Email': 'charlie@example.com', 'Department': 'HR', 'Salary': 65000, 'Start Date': '2022-09-12', 'Active': true },
];

// Helper function to detect data type
const detectDataType = (value: string): CellValue => {
  if (value === '' || value.toLowerCase() === 'null') return null;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  
  const num = Number(value);
  if (!isNaN(num) && isFinite(num) && value.trim() !== '') {
    return num;
  }
  
  return value;
};

export default function GridPage() {
  const [data, setData] = useState<DynamicRow[]>([]);
  const [tokens, setTokens] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Refs for measuring container dimensions
  const mainGridRef = useRef<HTMLDivElement>(null);
  const tokenGridRef = useRef<HTMLDivElement>(null);
  const [mainGridSize, setMainGridSize] = useState({ width: 800, height: 350 });
  const [tokenGridSize, setTokenGridSize] = useState({ width: 800, height: 350 });

  // Error handling state
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sorting state for main grid
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Token grid state - default 5 columns, 20 rows
  const [tokenGridData, setTokenGridData] = useState<DynamicRow[]>(() => {
    const initialData: DynamicRow[] = [];
    for (let i = 0; i < 20; i++) {
      initialData.push({
        'Token': '',
        'Result': '',
        'Status': '',
        'Notes': '',
        'Extra': ''
      });
    }
    return initialData;
  });

  // Sorting state for token grid
  const [tokenSortColumn, setTokenSortColumn] = useState<string | undefined>(undefined);
  const [tokenSortDirection, setTokenSortDirection] = useState<'asc' | 'desc'>('asc');

  // Column width state for main grid - initialize from localStorage
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('grid-column-widths');
        return saved ? JSON.parse(saved) : {};
      } catch (error) {
        console.warn('Failed to load grid column widths from localStorage:', error);
        return {};
      }
    }
    return {};
  });
  
  // Column width state for token grid - initialize from localStorage
  const [tokenColumnWidths, setTokenColumnWidths] = useState<{ [key: string]: number }>(() => {
    const defaults = {
      'Token': 150,
      'Result': 200,
      'Status': 100,
      'Notes': 150,
      'Extra': 120
    };
    
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('token-grid-column-widths');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
      } catch (error) {
        console.warn('Failed to load token grid column widths from localStorage:', error);
        return defaults;
      }
    }
    return defaults;
  });

  // Prevent SSR issues with DataGrid
  useEffect(() => {
    setMounted(true);
  }, []);


  // Resize observer to update grid dimensions
  useEffect(() => {
    if (!mounted) return;

    const updateMainGridSize = () => {
      if (mainGridRef.current) {
        const { width, height } = mainGridRef.current.getBoundingClientRect();
        setMainGridSize({ width: Math.max(width, 400), height: Math.max(height, 200) });
      }
    };

    const updateTokenGridSize = () => {
      if (tokenGridRef.current) {
        const { width, height } = tokenGridRef.current.getBoundingClientRect();
        setTokenGridSize({ width: Math.max(width, 400), height: Math.max(height, 200) });
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateMainGridSize();
      updateTokenGridSize();
    });

    if (mainGridRef.current) {
      resizeObserver.observe(mainGridRef.current);
      updateMainGridSize();
    }

    if (tokenGridRef.current) {
      resizeObserver.observe(tokenGridRef.current);
      updateTokenGridSize();
    }

    // Initial size calculation
    setTimeout(() => {
      updateMainGridSize();
      updateTokenGridSize();
    }, 100);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mounted]);

  // Sorting function for main grid
  const sortedData = useMemo(() => {
    if (!sortColumn || data.length === 0) return data;
    
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      // Handle null/undefined values
      if (aVal === null || aVal === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (bVal === null || bVal === undefined) return sortDirection === 'asc' ? -1 : 1;
      
      // Handle different data types
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // String comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [data, sortColumn, sortDirection]);

  // Dynamic columns based on data
  const columns: GridColumn[] = useMemo(() => {
    if (data.length === 0) {
      // Return a basic column structure when grid is empty
      return [
        { 
          title: 'Column 1', 
          id: 'col1', 
          width: columnWidths['col1'] || 150, 
          hasMenu: true
        },
        { 
          title: 'Column 2', 
          id: 'col2', 
          width: columnWidths['col2'] || 150, 
          hasMenu: true
        },
        { 
          title: 'Column 3', 
          id: 'col3', 
          width: columnWidths['col3'] || 150, 
          hasMenu: true
        }
      ];
    }
    
    const columnKeys = Object.keys(data[0]);
    return columnKeys.map(key => ({
      title: key,
      id: key,
      width: columnWidths[key] || Math.max(120, Math.min(200, key.length * 12 + 80)),
      hasMenu: true
    }));
  }, [data, columnWidths]);

  // Sorting function for token grid
  const sortedTokenData = useMemo(() => {
    if (!tokenSortColumn) return tokenGridData;
    
    const sorted = [...tokenGridData].sort((a, b) => {
      const aVal = a[tokenSortColumn];
      const bVal = b[tokenSortColumn];
      
      // Handle empty values
      if (!aVal && !bVal) return 0;
      if (!aVal) return tokenSortDirection === 'asc' ? 1 : -1;
      if (!bVal) return tokenSortDirection === 'asc' ? -1 : 1;
      
      // String comparison for token grid
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return tokenSortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return tokenSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [tokenGridData, tokenSortColumn, tokenSortDirection]);

  // Token grid columns - resizable structure
  const tokenColumns: GridColumn[] = useMemo(() => [
    { 
      title: 'Token', 
      id: 'Token', 
      width: tokenColumnWidths['Token'] || 150, 
      hasMenu: true
    },
    { 
      title: 'Result', 
      id: 'Result', 
      width: tokenColumnWidths['Result'] || 200, 
      hasMenu: true
    },
    { 
      title: 'Status', 
      id: 'Status', 
      width: tokenColumnWidths['Status'] || 100, 
      hasMenu: true
    },
    { 
      title: 'Notes', 
      id: 'Notes', 
      width: tokenColumnWidths['Notes'] || 150, 
      hasMenu: true
    },
    { 
      title: 'Extra', 
      id: 'Extra', 
      width: tokenColumnWidths['Extra'] || 120, 
      hasMenu: true
    }
  ], [tokenColumnWidths]);

  // Get cell content
  const getCellContent = useCallback(([col, row]: Item): EditableGridCell => {
    // Handle empty grid case
    if (sortedData.length === 0) {
      return { kind: GridCellKind.Text, data: '', allowOverlay: true, displayData: '' };
    }
    
    const rowData = sortedData[row];
    if (!rowData || !columns[col]) {
      return { kind: GridCellKind.Text, data: '', allowOverlay: false, displayData: '' };
    }

    const column = columns[col];
    if (!column || !column.id) return { kind: GridCellKind.Text, data: '', allowOverlay: false, displayData: '' };
    const value = rowData[column.id];

    if (value === null || value === undefined) {
      return { kind: GridCellKind.Text, data: '', allowOverlay: true, displayData: '' };
    }

    if (typeof value === 'boolean') {
      return { kind: GridCellKind.Boolean, data: value, allowOverlay: false };
    }

    if (typeof value === 'number') {
      // Format numbers nicely
      const displayValue = column.id.toLowerCase().includes('salary') || column.id.toLowerCase().includes('price') 
        ? `$${value.toLocaleString()}` 
        : value.toString();
      return { kind: GridCellKind.Number, data: value, allowOverlay: true, displayData: displayValue };
    }

    // Default to text
    return { kind: GridCellKind.Text, data: String(value), allowOverlay: true, displayData: String(value) };
  }, [sortedData, columns]);

  // Handle cell edits
  const onCellEdited = useCallback((cell: Item, newValue: EditableGridCell) => {
    const [col, row] = cell;
    const column = columns[col];
    
    if (!column || !column.id) return;
    
    setData(prev => {
      const newData = [...prev];
      const rowData = { ...newData[row] };
      
      // Update the specific cell value based on the new value type
      const columnId = column.id as string;
      if (newValue.kind === GridCellKind.Text) {
        rowData[columnId] = detectDataType(newValue.data);
      } else if (newValue.kind === GridCellKind.Number && typeof newValue.data === 'number') {
        rowData[columnId] = newValue.data;
      } else if (newValue.kind === GridCellKind.Boolean && typeof newValue.data === 'boolean') {
        rowData[columnId] = newValue.data;
      }
      
      newData[row] = rowData;
      return newData;
    });
  }, [columns]);

  // Get cell content for token grid
  const getTokenCellContent = useCallback(([col, row]: Item): EditableGridCell => {
    const rowData = sortedTokenData[row];
    if (!rowData || !tokenColumns[col]) {
      return { kind: GridCellKind.Text, data: '', allowOverlay: false, displayData: '' };
    }

    const column = tokenColumns[col];
    if (!column || !column.id) return { kind: GridCellKind.Text, data: '', allowOverlay: false, displayData: '' };
    const value = rowData[column.id];

    if (value === null || value === undefined) {
      return { kind: GridCellKind.Text, data: '', allowOverlay: true, displayData: '' };
    }

    return { kind: GridCellKind.Text, data: String(value), allowOverlay: true, displayData: String(value) };
  }, [sortedTokenData, tokenColumns]);

  // Handle cell edits for token grid
  const onTokenCellEdited = useCallback((cell: Item, newValue: EditableGridCell) => {
    const [col, row] = cell;
    const column = tokenColumns[col];
    
    if (!column || !column.id) return;
    
    setTokenGridData(prev => {
      const newData = [...prev];
      const rowData = { ...newData[row] };
      
      const columnId = column.id as string;
      if (newValue.kind === GridCellKind.Text) {
        rowData[columnId] = newValue.data;
      }
      
      newData[row] = rowData;
      return newData;
    });
  }, [tokenColumns]);

  // Handle header menu clicks for main grid sorting
  const onHeaderMenuClick = useCallback((col: number) => {
    const column = columns[col];
    if (!column?.id) return;

    const columnId = column.id as string;
    
    // Toggle sort direction if clicking same column, otherwise start with asc
    if (sortColumn === columnId) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  }, [columns, sortColumn]);

  // Handle header menu clicks for token grid sorting  
  const onTokenHeaderMenuClick = useCallback((col: number) => {
    const column = tokenColumns[col];
    if (!column?.id) return;

    const columnId = column.id as string;
    
    // Toggle sort direction if clicking same column, otherwise start with asc
    if (tokenSortColumn === columnId) {
      setTokenSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setTokenSortColumn(columnId);
      setTokenSortDirection('asc');
    }
  }, [tokenColumns, tokenSortColumn]);

  // Handle column resize for main grid
  const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
    if (!column.id) return;
    
    setColumnWidths(prev => {
      const newWidths = {
        ...prev,
        [column.id as string]: newSize
      };
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('grid-column-widths', JSON.stringify(newWidths));
        } catch (error) {
          console.warn('Failed to save grid column widths to localStorage:', error);
          setError('Failed to save column widths');
          setTimeout(() => setError(null), 3000);
        }
      }
      
      return newWidths;
    });
  }, []);

  // Handle column resize for token grid
  const onTokenColumnResize = useCallback((column: GridColumn, newSize: number) => {
    if (!column.id) return;
    
    setTokenColumnWidths(prev => {
      const newWidths = {
        ...prev,
        [column.id as string]: newSize
      };
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('token-grid-column-widths', JSON.stringify(newWidths));
        } catch (error) {
          console.warn('Failed to save token grid column widths to localStorage:', error);
          setError('Failed to save column widths');
          setTimeout(() => setError(null), 3000);
        }
      }
      
      return newWidths;
    });
  }, []);

  // Handle token processing - load tokens into leftmost column
  const processTokens = useCallback(() => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const tokenList = tokens.split(/\s*[,\n]\s*/).filter(token => token.trim());
      
      if (tokenList.length === 0) {
        setError('Please enter at least one token');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      if (tokenList.length > 1000) {
        setError('Too many tokens (max 1000)');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      // Update token grid with tokens in the leftmost column
      setTokenGridData(prev => {
      const newData = [...prev];
      
      // Clear existing data and add tokens
      for (let i = 0; i < Math.max(tokenList.length, 20); i++) {
        if (i < newData.length) {
          newData[i] = {
            'Token': i < tokenList.length ? tokenList[i].trim() : '',
            'Result': i < tokenList.length ? `Entity for token: ${tokenList[i].trim()}` : '',
            'Status': i < tokenList.length ? 'Processed' : '',
            'Notes': '',
            'Extra': ''
          };
        } else {
          // Add more rows if needed
          newData.push({
            'Token': tokenList[i].trim(),
            'Result': `Entity for token: ${tokenList[i].trim()}`,
            'Status': 'Processed',
            'Notes': '',
            'Extra': ''
          });
        }
      }
      
      return newData;
    });

      // Keep the old search results for backward compatibility
      const mockResults = tokenList.map(token => `Entity for token: ${token.trim()}`);
      setSearchResults(mockResults);
      
    } catch (error) {
      console.error('Error processing tokens:', error);
      setError('Failed to process tokens. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  }, [tokens]);

  const clearTokens = useCallback(() => {
    setTokens('');
    setSearchResults([]);
    // Reset token grid to empty state
    setTokenGridData(() => {
      const initialData: DynamicRow[] = [];
      for (let i = 0; i < 20; i++) {
        initialData.push({
          'Token': '',
          'Result': '',
          'Status': '',
          'Notes': '',
          'Extra': ''
        });
      }
      return initialData;
    });
  }, []);

  // Handle native paste events from Glide Data Grid
  const handleNativePaste = useCallback((cell: Item, data: readonly (readonly string[])[]) => {
    try {
      setError(null);
      const [, row] = cell;
      
      if (!data || data.length === 0) {
        setError('No data to paste');
        setTimeout(() => setError(null), 3000);
        return false;
      }
      
      if (data.length > 10000) {
        setError('Too much data to paste (max 10,000 rows)');
        setTimeout(() => setError(null), 3000);
        return false;
      }
      
      // For multi-row paste, always process as table data
      if (data.length > 1) {
        const headers = data[0];
        const rows: DynamicRow[] = [];
        
        // Process data rows (skip first row if it's headers)
        const dataRows = data.slice(1);
        for (const rowData of dataRows) {
          const newRow: DynamicRow = {};
          headers.forEach((header, index) => {
            const value = rowData[index] || '';
            newRow[header] = detectDataType(value);
          });
          rows.push(newRow);
        }
        
        if (rows.length > 0) {
          setData(rows);
          return false; // Prevent default cell editing
        }
      }
      
      // For single cell pastes, let default handling occur
      return true;
      
    } catch (error) {
      console.error('Error pasting data:', error);
      setError('Failed to paste data. Please check the format and try again.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  }, []);

  const clearGrid = useCallback(() => {
    setData([]);
  }, []);

  const addSampleData = useCallback(() => {
    setData(sampleData);
  }, []);

  // Reset column widths to defaults
  const resetColumnWidths = useCallback(() => {
    try {
      setError(null);
      setColumnWidths({});
      setTokenColumnWidths({
        'Token': 150,
        'Result': 200,
        'Status': 100,
        'Notes': 150,
        'Extra': 120
      });
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('grid-column-widths');
        localStorage.removeItem('token-grid-column-widths');
      }
    } catch (error) {
      console.error('Error resetting column widths:', error);
      setError('Failed to reset column widths');
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  // Export to CSV
  const exportToCSV = useCallback((gridType: 'main' | 'token') => {
    try {
      setError(null);
      const dataToExport = gridType === 'main' ? sortedData : sortedTokenData;
      const columnsToUse = gridType === 'main' ? columns : tokenColumns;

      // Create CSV content
      const headers = columnsToUse.map(col => col.title).join(',');
      const rows = dataToExport.map(row => {
        return columnsToUse.map(col => {
          const value = row[col.id || ''];
          // Escape commas and quotes in CSV
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',');
      }).join('\n');

      const csvContent = `${headers}\n${rows}`;
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${gridType}_grid_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      setError('Failed to export to CSV');
      setTimeout(() => setError(null), 3000);
    }
  }, [sortedData, sortedTokenData, columns, tokenColumns]);

  // Export to XLSX
  const exportToXLSX = useCallback((gridType: 'main' | 'token' | 'both') => {
    try {
      setError(null);
      
      const wb = XLSX.utils.book_new();

      // Export main grid
      if (gridType === 'main' || gridType === 'both') {
        const dataToExport = sortedData.length > 0 ? sortedData : [{}];
        const mainWS = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, mainWS, 'Main Data');
      }

      // Export token grid
      if (gridType === 'token' || gridType === 'both') {
        // Filter out empty rows from token data, or use empty object if no data
        const filteredTokenData = sortedTokenData.filter(row => 
          Object.values(row).some(val => val !== '' && val !== null)
        );
        const dataToExport = filteredTokenData.length > 0 ? filteredTokenData : [{}];
        const tokenWS = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, tokenWS, 'Token Data');
      }

      // Download file
      const fileName = gridType === 'both' 
        ? `all_grids_export_${new Date().toISOString().slice(0, 10)}.xlsx`
        : `${gridType}_grid_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      
      XLSX.writeFile(wb, fileName);
      
    } catch (error) {
      console.error('Error exporting to XLSX:', error);
      setError('Failed to export to Excel');
      setTimeout(() => setError(null), 3000);
    }
  }, [sortedData, sortedTokenData]);

  // Tools panel with Excel paste instructions and token input
  const tools = useMemo(() => (
    <section className="tool-section">
      <h2>Grid Tools</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>Excel Data</h3>
        <div style={{ 
          padding: '0.75rem',
          border: '2px dashed var(--border)',
          borderRadius: '6px',
          backgroundColor: 'var(--panel)',
          marginBottom: '0.5rem',
          fontSize: '0.9rem',
          color: 'var(--muted)'
        }}>
          <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
            📋 Copy from Excel/Sheets, then paste directly into grid
          </div>
          <div style={{ fontSize: '0.8rem', textAlign: 'center', marginBottom: '0.5rem' }}>
            <strong>Ctrl+V</strong> (Windows) or <strong>⌘V</strong> (Mac)
          </div>
          <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>
            Supports: Excel, Google Sheets, CSV
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button 
            onClick={clearGrid}
            style={{ flex: 1 }}
          >
            🗑️ Clear Grid
          </button>
          <button 
            onClick={addSampleData}
            style={{ flex: 1 }}
          >
            📊 Sample Data
          </button>
        </div>
        <button 
          onClick={resetColumnWidths}
          style={{ width: '100%', fontSize: '0.85rem' }}
        >
          📏 Reset Column Widths
        </button>
      </div>

      <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />

      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#dc2626',
          fontSize: '0.9rem',
          marginBottom: '1rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>Token Lookup</h3>
        <textarea
          value={tokens}
          onChange={(e) => setTokens(e.target.value)}
          placeholder="Paste tokens here (comma or newline separated)..."
          rows={3}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            fontSize: '0.9rem',
            resize: 'vertical',
          }}
        />
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={processTokens}
            disabled={!tokens.trim() || isProcessing}
            style={{ flex: 1 }}
          >
            {isProcessing ? '⏳ Processing...' : '⚙️ Process Tokens'}
          </button>
          <button 
            onClick={clearTokens}
            disabled={!tokens.trim() && searchResults.length === 0}
            style={{ flex: 1 }}
          >
            Clear
          </button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>Results ({searchResults.length})</h3>
          <div 
            style={{
              maxHeight: '150px',
              overflow: 'auto',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '0.5rem',
              fontSize: '0.8rem',
              backgroundColor: 'var(--panel)',
            }}
          >
            {searchResults.map((result, index) => (
              <div key={index} style={{ marginBottom: '0.25rem' }}>
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>Export Data</h3>
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Main Grid</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => exportToCSV('main')}
              style={{ flex: 1, fontSize: '0.85rem' }}
            >
              📄 CSV
            </button>
            <button
              onClick={() => exportToXLSX('main')}
              style={{ flex: 1, fontSize: '0.85rem' }}
            >
              📊 Excel
            </button>
          </div>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Token Grid</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => exportToCSV('token')}
              style={{ flex: 1, fontSize: '0.85rem' }}
            >
              📄 CSV
            </button>
            <button
              onClick={() => exportToXLSX('token')}
              style={{ flex: 1, fontSize: '0.85rem' }}
            >
              📊 Excel
            </button>
          </div>
        </div>
        <button
          onClick={() => exportToXLSX('both')}
          style={{ width: '100%', fontSize: '0.85rem' }}
        >
          📦 Export Both Grids to Excel
        </button>
      </div>

      <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />
      
      <div>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>Grid Info</h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
          <div>Rows: {sortedData.length}</div>
          <div>Columns: {columns.length}</div>
        </div>
      </div>
    </section>
  ), [tokens, searchResults, processTokens, clearTokens, clearGrid, addSampleData, resetColumnWidths, error, isProcessing, data, sortedData, columns.length, exportToCSV, exportToXLSX, tokenGridData]);

  useTools(tools, [tokens, searchResults]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      <div>
        <h2>Data Grid</h2>
        <p>Excel-like data grid with native paste support. Copy data from Excel or Google Sheets and paste directly into the grid using Ctrl+V (Windows) or ⌘V (Mac). Use the tools panel for token lookup.</p>
      </div>
      
      <div ref={mainGridRef} style={{ flex: 1, minHeight: '300px', width: '100%', display: 'flex' }}>
        {mounted ? (
          <DataEditor
            width={mainGridSize.width}
            height={mainGridSize.height}
            getCellContent={getCellContent}
            columns={columns}
            rows={Math.max(sortedData.length, 1)}
            onHeaderMenuClick={onHeaderMenuClick}
            onColumnResize={onColumnResize}
            onCellEdited={onCellEdited}
            onPaste={handleNativePaste}
            smoothScrollX={true}
            smoothScrollY={true}
            getCellsForSelection={true}
            keybindings={{ selectAll: true, selectRow: true, selectColumn: true }}
            rowSelect="single"
            columnSelect="single"
            rangeSelect="rect"
            theme={{
              accentColor: '#4F46E5',
              accentFg: '#FFFFFF',
              accentLight: 'rgba(79, 70, 229, 0.1)',
              textDark: '#1F2937',
              textMedium: '#6B7280',
              textLight: '#9CA3AF',
              textBubble: '#FFFFFF',
              bgIconHeader: '#F9FAFB',
              fgIconHeader: '#6B7280',
              textHeader: '#1F2937',
              textGroupHeader: '#1F2937',
              bgCell: '#FFFFFF',
              bgCellMedium: '#F9FAFB',
              bgHeader: '#F3F4F6',
              bgHeaderHasFocus: '#E5E7EB',
              bgHeaderHovered: '#E5E7EB',
              bgBubble: '#FFFFFF',
              bgBubbleSelected: '#4F46E5',
              bgSearchResult: '#FEF3C7',
              borderColor: 'rgba(31, 41, 55, 0.1)',
              drilldownBorder: 'rgba(0, 0, 0, 0)',
              linkColor: '#4F46E5',
              headerFontStyle: '600 13px',
              baseFontStyle: '13px',
              fontFamily: 'Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif',
            }}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1,
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--muted)'
          }}>
            Loading grid...
          </div>
        )}
      </div>

      <div>
        <h3>Token Processing Grid</h3>
        <p>Process tokens using the tools panel. Tokens will be loaded into the leftmost column with results.</p>
      </div>
      
      <div ref={tokenGridRef} style={{ flex: 1, minHeight: '300px', width: '100%', display: 'flex' }}>
        {mounted ? (
          <DataEditor
            width={tokenGridSize.width}
            height={tokenGridSize.height}
            getCellContent={getTokenCellContent}
            columns={tokenColumns}
            rows={sortedTokenData.length}
            onHeaderMenuClick={onTokenHeaderMenuClick}
            onColumnResize={onTokenColumnResize}
            onCellEdited={onTokenCellEdited}
            smoothScrollX={true}
            smoothScrollY={true}
            getCellsForSelection={true}
            keybindings={{ selectAll: true, selectRow: true, selectColumn: true }}
            rowSelect="single"
            columnSelect="single"
            rangeSelect="rect"
            theme={{
              accentColor: '#059669',
              accentFg: '#FFFFFF',
              accentLight: 'rgba(5, 150, 105, 0.1)',
              textDark: '#1F2937',
              textMedium: '#6B7280',
              textLight: '#9CA3AF',
              textBubble: '#FFFFFF',
              bgIconHeader: '#F9FAFB',
              fgIconHeader: '#6B7280',
              textHeader: '#1F2937',
              textGroupHeader: '#1F2937',
              bgCell: '#FFFFFF',
              bgCellMedium: '#F9FAFB',
              bgHeader: '#F3F4F6',
              bgHeaderHasFocus: '#E5E7EB',
              bgHeaderHovered: '#E5E7EB',
              bgBubble: '#FFFFFF',
              bgBubbleSelected: '#059669',
              bgSearchResult: '#FEF3C7',
              borderColor: 'rgba(31, 41, 55, 0.1)',
              drilldownBorder: 'rgba(0, 0, 0, 0)',
              linkColor: '#059669',
              headerFontStyle: '600 13px',
              baseFontStyle: '13px',
              fontFamily: 'Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif',
            }}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1,
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--muted)'
          }}>
            Loading token grid...
          </div>
        )}
      </div>
    </div>
  );
}