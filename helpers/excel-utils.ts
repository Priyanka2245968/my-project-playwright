import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Excel utility helper for reading test data from Excel files.
 * Migrated from Apache POI (Java) to xlsx library (TypeScript).
 */
export class ExcelUtils {
  private static readonly TEST_DATA_EXCEL_FILE_NAME = '../test-data/testdata.xlsx';
  private static readonly CURRENT_DIR = process.cwd();
  private static readonly RESOURCE_PATH = '/src/test/resources/';
  private static workbook: XLSX.WorkBook | null = null;
  private static worksheet: XLSX.WorkSheet | null = null;
  private static currentSheetName: string | null = null;

  /**
   * Sets the Excel file and sheet to work with.
   * @param sheetName - Name of the sheet to read from
   */
  public static async setExcelFileSheet(sheetName: string): Promise<void> {
    const testDataExcelPath = path.join(
      this.CURRENT_DIR,
      this.RESOURCE_PATH,
      this.TEST_DATA_EXCEL_FILE_NAME
    );

    try {
      const fileBuffer = fs.readFileSync(testDataExcelPath);
      this.workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      this.worksheet = this.workbook.Sheets[sheetName];
      this.currentSheetName = sheetName;

      if (!this.worksheet) {
        throw new Error(`Sheet "${sheetName}" not found in workbook`);
      }
    } catch (error) {
      throw new Error(`Failed to load Excel file: ${testDataExcelPath}. Error: ${error}`);
    }
  }

  /**
   * Reads data from a specific cell.
   * @param rowNum - Row number (0-based index)
   * @param colNum - Column number (0-based index)
   * @returns Cell value as string
   */
  public static getCellData(rowNum: number, colNum: number): string {
    if (!this.worksheet) {
      throw new Error('Worksheet not initialized. Call setExcelFileSheet() first.');
    }

    // Convert 0-based row/col to Excel cell reference (A1 notation)
    const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
    const cell = this.worksheet[cellAddress];

    if (!cell) {
      return '';
    }

    // Format cell value to string (handles numbers, dates, etc.)
    return XLSX.utils.format_cell(cell);
  }

  /**
   * Returns the total number of rows in the current sheet.
   * @returns Row count
   */
  public static getRowCount(): number {
    if (!this.worksheet) {
      throw new Error('Worksheet not initialized. Call setExcelFileSheet() first.');
    }

    const range = XLSX.utils.decode_range(this.worksheet['!ref'] || 'A1');
    return range.e.r + 1; // End row index + 1 for total count
  }

  /**
   * Returns all data from a specific row.
   * @param rowNum - Row number (0-based index)
   * @returns Array of cell values as strings
   */
  public static getRowData(rowNum: number): string[] {
    if (!this.worksheet) {
      throw new Error('Worksheet not initialized. Call setExcelFileSheet() first.');
    }

    const range = XLSX.utils.decode_range(this.worksheet['!ref'] || 'A1');
    const rowData: string[] = [];

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: col });
      const cell = this.worksheet[cellAddress];
      rowData.push(cell ? XLSX.utils.format_cell(cell) : '');
    }

    return rowData;
  }

  /**
   * Sets a value in a specific cell and saves the workbook.
   * @param value - Value to set
   * @param rowNum - Row number (0-based index)
   * @param colNum - Column number (0-based index)
   */
  public static async setCellData(value: string, rowNum: number, colNum: number): Promise<void> {
    if (!this.workbook || !this.worksheet || !this.currentSheetName) {
      throw new Error('Worksheet not initialized. Call setExcelFileSheet() first.');
    }

    const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
    this.worksheet[cellAddress] = { t: 's', v: value };

    // Update workbook with modified sheet
    this.workbook.Sheets[this.currentSheetName] = this.worksheet;

    // Write to file
    const testDataExcelPath = path.join(
      this.CURRENT_DIR,
      this.RESOURCE_PATH,
      this.TEST_DATA_EXCEL_FILE_NAME
    );

    const buffer = XLSX.write(this.workbook, { type: 'buffer', bookType: 'xlsx' });
    fs.writeFileSync(testDataExcelPath, buffer);
  }

  /**
   * Helper method to get all data from the current sheet as a 2D array.
   * Useful for iterating through test data.
   * @returns 2D array of cell values
   */
  public static getSheetData(): string[][] {
    if (!this.worksheet) {
      throw new Error('Worksheet not initialized. Call setExcelFileSheet() first.');
    }

    return XLSX.utils.sheet_to_json(this.worksheet, { header: 1, defval: '' }) as string[][];
  }

  /**
   * Helper method to convert Excel data to array of objects.
   * First row is treated as headers.
   * @returns Array of objects with header keys
   */
  public static getSheetDataAsObjects<T = Record<string, string>>(): T[] {
    if (!this.worksheet) {
      throw new Error('Worksheet not initialized. Call setExcelFileSheet() first.');
    }

    return XLSX.utils.sheet_to_json(this.worksheet, { defval: '' }) as T[];
  }
}
