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
    <div className="flex flex-col w-full pb-24">
      <section className="pt-24 pb-12 px-6 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter mb-4 text-foreground">
          Data Explorer
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-10 max-w-2xl">
          Browse and filter the complete Apple product pricing dataset.
        </p>
      </section>

      <section className="px-6 max-w-7xl mx-auto w-full mb-12">
        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col">
          <div className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-secondary/30 p-4 md:p-6 rounded-[2rem]">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products or countries..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-12 bg-background border-none shadow-sm h-14 rounded-full text-lg w-full"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={regionFilter} onValueChange={(val) => { setRegionFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background border-none shadow-sm h-14 rounded-full text-base font-medium px-6">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={incomeFilter} onValueChange={(val) => { setIncomeFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[200px] bg-background border-none shadow-sm h-14 rounded-full text-base font-medium px-6">
                  <SelectValue placeholder="Income Group" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  <SelectItem value="all">All Income Groups</SelectItem>
                  {uniqueIncomeGroups.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={resetFilters} 
                title="Reset Filters"
                className="h-14 w-14 rounded-full bg-background border-none shadow-sm hover:bg-secondary transition-colors"
              >
                <FilterX className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="rounded-[1.5rem] overflow-hidden bg-background border border-border/50">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="cursor-pointer hover:text-primary transition-colors py-5 px-6 font-semibold" onClick={() => requestSort("model")}>
                    <div className="flex items-center gap-2">
                      Product Name
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="py-5 px-6 font-semibold">Country</TableHead>
                  <TableHead className="py-5 px-6 font-semibold">Region</TableHead>
                  <TableHead className="cursor-pointer hover:text-primary transition-colors py-5 px-6 font-semibold" onClick={() => requestSort("incomeGroup")}>
                    <div className="flex items-center gap-2">
                      Income Group
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:text-primary transition-colors py-5 px-6 font-semibold" onClick={() => requestSort("price_usd")}>
                    <div className="flex items-center justify-end gap-2">
                      Price (USD)
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i} className="border-border/50">
                      <TableCell className="px-6 py-4"><Skeleton className="h-6 w-40" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-6 w-28" /></TableCell>
                      <TableCell className="px-6 py-4 text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, idx) => (
                    <TableRow key={item._id || idx} className="hover:bg-secondary/20 transition-colors border-border/50">
                      <TableCell className="font-semibold px-6 py-4 text-base">{item.model}</TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground font-medium">{item.country}</TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium whitespace-nowrap">
                          {item.region}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                         <span className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider ${
                           item.incomeGroup === 'High income' ? 'bg-primary/10 text-primary' :
                           item.incomeGroup === 'Upper middle income' ? 'bg-ring/10 text-ring' :
                           'bg-destructive/10 text-destructive'
                         }`}>
                           {item.incomeGroup}
                         </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-lg px-6 py-4">
                        ${item.price_usd.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium text-lg">
                      No matching data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4 px-2">
            <div className="text-base text-muted-foreground font-medium">
              Showing <span className="text-foreground">{paginatedData.length}</span> of <span className="text-foreground">{sortedData.length}</span> entries
            </div>
            <div className="flex items-center gap-4 bg-secondary/30 p-2 rounded-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="rounded-full border-none bg-background shadow-sm h-10 px-4 hover:bg-secondary hover:text-foreground transition-all font-medium"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Prev
              </Button>
              <div className="flex items-center justify-center min-w-[60px] text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                {currentPage} / {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0 || loading}
                className="rounded-full border-none bg-background shadow-sm h-10 px-4 hover:bg-secondary hover:text-foreground transition-all font-medium"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
