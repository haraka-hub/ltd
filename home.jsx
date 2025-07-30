import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowRight, MapPin, Shield, Star } from "lucide-react";
import { User } from "../entities/User";
import { Job } from "../entities/Job";
import { createPageUrl } from "../utils";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [featuredTalents, setFeaturedTalents] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch {}

      const talents = await User.filter(
        { user_type: "talent", is_verified: true },
        "-rating",
        6
      );
      setFeaturedTalents(talents);

      const jobs = await Job.filter({ status: "open" }, "-created_date", 6);
      setRecentJobs(jobs);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const featuredCategories = [
    { name: "Technology", icon: "💻", jobs: 245 },
    { name: "Design", icon: "🎨", jobs: 189 },
    { name: "Construction", icon: "🏗️", jobs: 156 },
    { name: "Beauty", icon: "💄", jobs: 134 },
    { name: "Photography", icon: "📸", jobs: 98 },
    { name: "Tutoring", icon: "📚", jobs: 167 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to HARAKA CONNECT</h1>
        <p className="text-lg mb-6">
          Connect with professionals across Africa. Hire or get hired.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {!currentUser ? (
            <>
              <Link to={createPageUrl("Welcome")}> 
                <Button variant="secondary">Get Started</Button>
              </Link>
              <Link to={createPageUrl("Browse")}> 
                <Button variant="outline" className="text-white border-white hover:text-orange-600 hover:bg-white">
                  Browse Talents
                </Button>
              </Link>
            </>
          ) : (
            <Link to={createPageUrl(currentUser.user_type === "talent" ? "TalentDashboard" : "ClientDashboard")}>
              <Button variant="secondary">Go to Dashboard</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Featured Talents */}
      <section className="py-16 px-4 bg-orange-50">
        <h2 className="text-2xl font-bold text-center mb-8">Top Verified Talents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {(loading ? Array(6).fill({}) : featuredTalents).map((talent, idx) => (
            <Card key={idx} className="text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  {talent.profile_picture ? (
                    <img
                      src={talent.profile_picture}
                      alt={talent.full_name}
                      className="w-16 h-16 rounded-full object-cover mx-auto border"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
                      {talent.full_name?.charAt(0) || "T"}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{talent.full_name}</h3>
                <p className="text-gray-500 text-sm flex justify-center items-center gap-1">
                  <MapPin className="w-4 h-4" /> {talent.location || "—"}
                </p>
                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                  {talent.skills?.slice(0, 3).map((skill, index) => (
                    <Badge key={index} className="bg-orange-100 text-orange-700 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 text-sm text-yellow-500 mt-2">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  {talent.rating || 0} ({talent.total_reviews || 0})
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">Latest Opportunities</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {(loading ? Array(4).fill({}) : recentJobs).map((job, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {job.title || "..."}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {job.description || "..."}
                </p>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {job.location || "—"}
                  </span>
                  <span className="text-green-600 font-semibold">
                    UGX {job.budget_min?.toLocaleString()} - {job.budget_max?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {job.applications_count || 0} applications
                  </span>
                  <Link to={createPageUrl(`Jobs?id=${job.id}`)}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-blue-600 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Career?</h2>
        <p className="text-lg mb-6">Join thousands already growing with HARAKA CONNECT</p>
        {!currentUser && (
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to={createPageUrl("Welcome")}> <Button variant="secondary">Start as a Talent</Button> </Link>
            <Link to={createPageUrl("Welcome")}> <Button variant="outline" className="text-white border-white hover:text-orange-600 hover:bg-white">Hire Talent</Button> </Link>
          </div>
        )}
      </section>
    </div>
  );
}
