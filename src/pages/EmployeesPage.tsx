import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Trash2,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { useAuth } from '@/context/AuthContext';
import { Employee } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const EmployeesPage: React.FC = () => {
  const { employees, addEmployee, deleteEmployee } = useHotel();
  const { role } = useAuth();
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New employee state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<
    'Front Desk' | 'Housekeeping' | 'Maintenance' | 'Management' | 'Food & Beverage'
  >('Front Desk');
  const [position, setPosition] = useState('Front Desk Agent');
  const [salary, setSalary] = useState(3200);

  const departments = [
    'all',
    'Front Desk',
    'Housekeeping',
    'Maintenance',
    'Management',
    'Food & Beverage',
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    addEmployee({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+33 6 00 00 00 00',
      department,
      position: position.trim() || 'Staff Member',
      salary: Number(salary),
      hireDate: new Date().toISOString().split('T')[0],
      attendanceStatus: 'present',
    });

    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setIsAddModalOpen(false);
  };

  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + e.salary, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Staff & Hotel Human Resources
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Department rosters, shifts, staff compensations, and daily attendance records.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
        >
          Add Staff Member
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Hotel Staff
          </p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
            {employees.length} Team Members
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Across 5 hospitality departments</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Today's Attendance Rate
          </p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.round(
              (employees.filter((e) => e.attendanceStatus === 'present').length /
                (employees.length || 1)) *
                100
            )}
            % Present
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {employees.filter((e) => e.attendanceStatus === 'present').length} active on shift
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Monthly Department Payroll
          </p>
          <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            ${totalMonthlyPayroll.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Base salary allocation</p>
        </div>
      </div>

      {/* Department Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                departmentFilter === dept
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff by name, title, or email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-hidden focus:border-blue-500"
            />
          </div>
          <div className="text-xs font-semibold text-slate-400">
            Showing {filteredEmployees.length} of {employees.length} staff
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {emp.firstName[0]}
                    {emp.lastName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                      {emp.firstName} {emp.lastName}
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      {emp.position}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {emp.department}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    emp.attendanceStatus === 'present'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : emp.attendanceStatus === 'on_leave'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {emp.attendanceStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 my-3">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{emp.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Hired: {emp.hireDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Monthly Compensation
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  ${emp.salary.toLocaleString()} / mo
                </span>
              </div>

              {role === 'admin' ? (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${emp.firstName} ${emp.lastName} from staff records?`)) {
                      deleteEmployee(emp.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Remove Employee"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 font-semibold">Active Roster</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Hotel Team Member"
        description="Register a new staff member into the property management HR system."
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Jean"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Dupont"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@grandazure.com"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                <option value="Front Desk">Front Desk</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Management">Management</option>
                <option value="Food & Beverage">Food & Beverage</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Position / Job Title *
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Concierge"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Monthly Salary ($)
            </label>
            <input
              type="number"
              min="1000"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
