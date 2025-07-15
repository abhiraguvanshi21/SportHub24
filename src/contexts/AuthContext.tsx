import React, { createContext, useContext, useState, useEffect } from "react";

interface MatchHistory {
  id: string;
  matchTitle: string;
  date: string;
  venue: string;
  format: string;
  result: string;
  playerStats: {
    batting?: {
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      strikeRate: number;
      status: string;
    };
    bowling?: {
      overs: number;
      maidens: number;
      runs: number;
      wickets: number;
      economy: number;
    };
    fielding?: {
      catches: number;
      runOuts: number;
      stumpings: number;
    };
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location?: string;
  profileImageUrl?: string;
  joinedDate: string;
  stats: {
    matchesPlayed: number;
    matchesScored: number;
    totalRuns: number;
    totalWickets: number;
    bestBowling: string;
    highestScore: number;
    battingAverage: number;
    bowlingAverage: number;
    strikeRate: number;
    economyRate: number;
    totalCatches: number;
    totalRunOuts: number;
    totalStumpings: number;
    centuries: number;
    halfCenturies: number;
    fiveWicketHauls: number;
    totalFours: number;
    totalSixes: number;
    totalBallsFaced: number;
    totalOversBowled: number;
    totalMaidens: number;
  };
  achievements: string[];
  favoriteTeam?: string;
  playingRole:
    | "Batsman"
    | "Bowler"
    | "All-rounder"
    | "Wicket-keeper"
    | "Not specified";
  matchHistory: MatchHistory[];
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  signup: (
    userData: Partial<User> & { password: string; profileImageUrl?: string }
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  updateMatchStats: (matchData: MatchHistory) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem("sportHub24User");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure all required fields exist for backward compatibility
        const completeUser: User = {
          ...parsedUser,
          matchHistory: parsedUser.matchHistory || [],
          stats: {
            matchesPlayed: parsedUser.stats?.matchesPlayed || 0,
            matchesScored: parsedUser.stats?.matchesScored || 0,
            totalRuns: parsedUser.stats?.totalRuns || 0,
            totalWickets: parsedUser.stats?.totalWickets || 0,
            bestBowling: parsedUser.stats?.bestBowling || "0/0",
            highestScore: parsedUser.stats?.highestScore || 0,
            battingAverage: parsedUser.stats?.battingAverage || 0,
            bowlingAverage: parsedUser.stats?.bowlingAverage || 0,
            strikeRate: parsedUser.stats?.strikeRate || 0,
            economyRate: parsedUser.stats?.economyRate || 0,
            totalCatches: parsedUser.stats?.totalCatches || 0,
            totalRunOuts: parsedUser.stats?.totalRunOuts || 0,
            totalStumpings: parsedUser.stats?.totalStumpings || 0,
            centuries: parsedUser.stats?.centuries || 0,
            halfCenturies: parsedUser.stats?.halfCenturies || 0,
            fiveWicketHauls: parsedUser.stats?.fiveWicketHauls || 0,
            totalFours: parsedUser.stats?.totalFours || 0,
            totalSixes: parsedUser.stats?.totalSixes || 0,
            totalBallsFaced: parsedUser.stats?.totalBallsFaced || 0,
            totalOversBowled: parsedUser.stats?.totalOversBowled || 0,
            totalMaidens: parsedUser.stats?.totalMaidens || 0,
          },
        };
        setUser(completeUser);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("sportHub24User");
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check for existing user or create demo user
      let userData: User;

      if (email === "demo@sporthub24.com" && password === "demo123") {
        userData = {
          id: "demo-user",
          name: "Demo Cricket Player",
          email: email,
          phone: "+1 (555) 123-4567",
          dateOfBirth: "1990-05-15",
          location: "Mumbai, India",
          profileImageUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          joinedDate: "2024-01-01",
          stats: {
            matchesPlayed: 45,
            matchesScored: 12,
            totalRuns: 1250,
            totalWickets: 23,
            bestBowling: "4/32",
            highestScore: 89,
            battingAverage: 32.5,
            bowlingAverage: 28.4,
            strikeRate: 125.6,
            economyRate: 7.2,
            totalCatches: 15,
            totalRunOuts: 3,
            totalStumpings: 0,
            centuries: 0,
            halfCenturies: 8,
            fiveWicketHauls: 1,
            totalFours: 145,
            totalSixes: 32,
            totalBallsFaced: 995,
            totalOversBowled: 89.2,
            totalMaidens: 8,
          },
          achievements: [
            "Best Bowler 2023",
            "Century Maker",
            "Match Winner",
            "Five Wicket Haul",
          ],
          favoriteTeam: "Mumbai Indians",
          playingRole: "All-rounder",
          matchHistory: [
            {
              id: "1",
              matchTitle: "Local Club Championship Final",
              date: "2024-01-10",
              venue: "Oval Ground, Mumbai",
              format: "T20",
              result: "Won by 25 runs",
              playerStats: {
                batting: {
                  runs: 45,
                  balls: 32,
                  fours: 6,
                  sixes: 1,
                  strikeRate: 140.6,
                  status: "Not Out",
                },
                bowling: {
                  overs: 4,
                  maidens: 0,
                  runs: 28,
                  wickets: 2,
                  economy: 7.0,
                },
                fielding: {
                  catches: 1,
                  runOuts: 0,
                  stumpings: 0,
                },
              },
            },
            {
              id: "2",
              matchTitle: "Corporate Cricket League",
              date: "2024-01-05",
              venue: "Sports Complex, Bangalore",
              format: "ODI",
              result: "Lost by 15 runs",
              playerStats: {
                batting: {
                  runs: 89,
                  balls: 78,
                  fours: 12,
                  sixes: 2,
                  strikeRate: 114.1,
                  status: "Bowled",
                },
                bowling: {
                  overs: 8,
                  maidens: 1,
                  runs: 45,
                  wickets: 1,
                  economy: 5.6,
                },
                fielding: {
                  catches: 2,
                  runOuts: 1,
                  stumpings: 0,
                },
              },
            },
          ],
        };
      } else {
        // Check if user exists in localStorage
        const existingUsers = JSON.parse(
          localStorage.getItem("sportHub24Users") || "[]"
        );
        const existingUser = (existingUsers as User[]).find(
          (u: User) => u.email === email
        );

        if (!existingUser) {
          return false; // User not found
        }

        // In a real app, you'd verify the password hash
        userData = existingUser;
      }

      setUser(userData);
      localStorage.setItem("sportHub24User", JSON.stringify(userData));

      if (rememberMe) {
        localStorage.setItem("sportHub24RememberMe", "true");
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    userData: Partial<User> & { password: string; profileImageUrl?: string }
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        dateOfBirth: userData.dateOfBirth || "",
        location: userData.location || "",
        profileImageUrl: userData.profileImageUrl,
        joinedDate: new Date().toISOString().split("T")[0],
        stats: {
          matchesPlayed: 0,
          matchesScored: 0,
          totalRuns: 0,
          totalWickets: 0,
          bestBowling: "0/0",
          highestScore: 0,
          battingAverage: 0,
          bowlingAverage: 0,
          strikeRate: 0,
          economyRate: 0,
          totalCatches: 0,
          totalRunOuts: 0,
          totalStumpings: 0,
          centuries: 0,
          halfCenturies: 0,
          fiveWicketHauls: 0,
          totalFours: 0,
          totalSixes: 0,
          totalBallsFaced: 0,
          totalOversBowled: 0,
          totalMaidens: 0,
        },
        achievements: [],
        favoriteTeam: userData.favoriteTeam,
        playingRole: userData.playingRole || "Not specified",
        matchHistory: [],
      };

      // Store user in users list
      const existingUsers = JSON.parse(
        localStorage.getItem("sportHub24Users") || "[]"
      );
      existingUsers.push({ ...newUser, password: userData.password }); // In real app, hash the password
      localStorage.setItem("sportHub24Users", JSON.stringify(existingUsers));

      setUser(newUser);
      localStorage.setItem("sportHub24User", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sportHub24User");
    localStorage.removeItem("sportHub24RememberMe");
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("sportHub24User", JSON.stringify(updatedUser));

      // Update in users list too
      const existingUsers = JSON.parse(
        localStorage.getItem("sportHub24Users") || "[]"
      );
      const userIndex = (existingUsers as User[]).findIndex(
        (u: User) => u.id === user.id
      );

      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], ...userData };
        localStorage.setItem("sportHub24Users", JSON.stringify(existingUsers));
      }

      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMatchStats = async (
    matchData: MatchHistory
  ): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      // Calculate new stats based on match data
      const newStats = { ...user.stats };
      const newMatchHistory = [...user.matchHistory, matchData];

      // Update match count
      newStats.matchesPlayed += 1;

      // Update batting stats
      if (matchData.playerStats.batting) {
        const batting = matchData.playerStats.batting;
        newStats.totalRuns += batting.runs;
        newStats.totalBallsFaced += batting.balls;
        newStats.totalFours += batting.fours;
        newStats.totalSixes += batting.sixes;

        if (batting.runs > newStats.highestScore) {
          newStats.highestScore = batting.runs;
        }

        if (batting.runs >= 100) {
          newStats.centuries += 1;
        } else if (batting.runs >= 50) {
          newStats.halfCenturies += 1;
        }

        // Recalculate batting average and strike rate
        newStats.battingAverage = newStats.totalRuns / newStats.matchesPlayed;
        newStats.strikeRate =
          newStats.totalBallsFaced > 0
            ? (newStats.totalRuns / newStats.totalBallsFaced) * 100
            : 0;
      }

      // Update bowling stats
      if (matchData.playerStats.bowling) {
        const bowling = matchData.playerStats.bowling;
        newStats.totalWickets += bowling.wickets;
        newStats.totalOversBowled += bowling.overs;
        newStats.totalMaidens += bowling.maidens;

        if (bowling.wickets >= 5) {
          newStats.fiveWicketHauls += 1;
        }

        // Update best bowling if better
        const currentBest = newStats.bestBowling.split("/");
        if (
          bowling.wickets > parseInt(currentBest[0]) ||
          (bowling.wickets === parseInt(currentBest[0]) &&
            bowling.runs < parseInt(currentBest[1]))
        ) {
          newStats.bestBowling = `${bowling.wickets}/${bowling.runs}`;
        }

        // Recalculate bowling average and economy rate
        newStats.bowlingAverage =
          newStats.totalWickets > 0
            ? newStats.totalRuns / newStats.totalWickets
            : 0;
        newStats.economyRate =
          newStats.totalOversBowled > 0
            ? newStats.totalRuns / newStats.totalOversBowled
            : 0;
      }

      // Update fielding stats
      if (matchData.playerStats.fielding) {
        const fielding = matchData.playerStats.fielding;
        newStats.totalCatches += fielding.catches;
        newStats.totalRunOuts += fielding.runOuts;
        newStats.totalStumpings += fielding.stumpings;
      }

      const updatedUser = {
        ...user,
        stats: newStats,
        matchHistory: newMatchHistory,
      };

      setUser(updatedUser);
      localStorage.setItem("sportHub24User", JSON.stringify(updatedUser));

      return true;
    } catch (error) {
      console.error("Match stats update error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    updateMatchStats,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
