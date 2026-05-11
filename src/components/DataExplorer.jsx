import React, { useState, useEffect, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
import { Input } from "./ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  FilterX,
  Database
} from "lucide-react";
import { BACKEND_URL } from "../config";

export default function DataExplorer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [incomeFilter, setIncomeFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "model", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch(BACKEND_URL + "/api/products/all")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Filter options
  const uniqueCountries = useMemo(() => [...new Set(data.map(item => item.country))].sort(), [data]);
  const uniqueRegions = useMemo(() => [...new Set(data.map(item => item.region))].sort(), [data]);
  const uniqueIncomeGroups = useMemo(() => [...new Set(data.map(item => item.incomeGroup))].sort(), [data]);

  // Filtering logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = countryFilter === "all" || item.country === countryFilter;
      const matchesRegion = regionFilter === "all" || item.region === regionFilter;
      const matchesIncome = incomeFilter === "all" || item.incomeGroup === incomeFilter;
      
      return matchesSearch && matchesCountry && matchesRegion && matchesIncome;
    });
  }, [data, searchTerm, countryFilter, regionFilter, incomeFilter]);

  // Sorting logic
  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "price_usd") {
           return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCountryFilter("all");
    setRegionFilter("all");
    setIncomeFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Explorer</h1>
        <p className="text-muted-foreground">
          Browse and filter the complete Apple product pricing dataset.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or countries..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 bg-white"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={regionFilter} onValueChange={(val) => { setRegionFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-[160px] bg-white">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={incomeFilter} onValueChange={(val) => { setIncomeFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-[160px] bg-white">
                  <SelectValue placeholder="Income Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Income Groups</SelectItem>
                  {uniqueIncomeGroups.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={resetFilters} title="Reset Filters">
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort("model")}>
                    <div className="flex items-center gap-2">
                      Product Name
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort("incomeGroup")}>
                    <div className="flex items-center gap-2">
                      Income Group
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort("price_usd")}>
                    <div className="flex items-center justify-end gap-2">
                      Price (USD)
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, idx) => (
                    <TableRow key={item._id || idx} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">{item.model}</TableCell>
                      <TableCell>{item.country}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium whitespace-nowrap">
                          {item.region}
                        </span>
                      </TableCell>
                      <TableCell>
                         <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                           item.incomeGroup === 'High income' ? 'bg-blue-100 text-blue-700' :
                           item.incomeGroup === 'Upper middle income' ? 'bg-purple-100 text-purple-700' :
                           'bg-orange-100 text-orange-700'
                         }`}>
                           {item.incomeGroup}
                         </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-indigo-600">
                        ${item.price_usd.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                      No matching data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{paginatedData.length}</span> of <span className="font-medium">{sortedData.length}</span> entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center justify-center min-w-[80px] text-sm font-medium">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0 || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
