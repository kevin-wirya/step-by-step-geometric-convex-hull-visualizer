#include "convex_hull.h"
#include <algorithm>
#include <cmath>
#include <functional>
vector<AlgorithmicStep> quickHull(vector<Point> points){
    vector<AlgorithmicStep> steps;
    vector<Point> discarded_points;
    vector<Point> hull;
    auto recordStep=[&](const string& desc,const vector<Point>& current_hull,const vector<Point>& active_pts,const vector<Line>& active_lns){
        AlgorithmicStep step;
        step.description=desc;
        step.hull=current_hull;
        step.active=active_pts;
        step.discarded=discarded_points;
        step.activeLines=active_lns;
        steps.push_back(step);
    };
    vector<Point> unique_points;
    for(const auto& p:points){
        bool is_duplicate=false;
        for(const auto& up:unique_points){
            if(up.x==p.x&&up.y==p.y){
                is_duplicate=true;
                break;
            }
        }
        if(!is_duplicate)unique_points.push_back(p);
    }
    if(unique_points.size()!=points.size()){
        AlgorithmicStep step;
        step.description="Removed "+to_string(points.size()-unique_points.size())+" duplicate point(s).";
        step.hull=unique_points;
        steps.push_back(step);
        points=unique_points;
    }
    if(points.size()<3){
        AlgorithmicStep step;
        step.description="Cannot compute convex hull: Less than 3 unique points.";
        step.hull=points;
        steps.push_back(step);
        return steps;
    }
    int min_idx=0,max_idx=0;
    for(size_t i=1;i<points.size();i++){
        if(points[i].x<points[min_idx].x||(points[i].x==points[min_idx].x&&points[i].y<points[min_idx].y))min_idx=i;
        if(points[i].x>points[max_idx].x||(points[i].x==points[max_idx].x&&points[i].y>points[max_idx].y))max_idx=i;
    }
    Point A=points[min_idx],B=points[max_idx];
    hull.push_back(A);
    hull.push_back(B);
    vector<Point> leftSet,rightSet;
    for(const auto& p:points){
        if(p.id==A.id||p.id==B.id)continue;
        double orient=getOrientation(A,B,p);
        if(orient<0)leftSet.push_back(p);
        else if(orient>0)rightSet.push_back(p);
        else discarded_points.push_back(p);
    }
    recordStep("Selected P"+A.id+" (leftmost) and P"+B.id+" (rightmost) as the initial baseline.",hull,{A,B},{{A,B}});
    auto findFurthest=[&](Point p1,Point p2,const vector<Point>& ptsSet)->Point{
        Point furthest=ptsSet[0];
        double max_dist=-1;
        for(const auto& p:ptsSet){
            double dist=abs(getOrientation(p1,p2,p));
            if(dist>max_dist){
                max_dist=dist;
                furthest=p;
            }else if(dist==max_dist){
                if(getSquaredDistance(p1,p)>getSquaredDistance(p1,furthest))furthest=p;
            }
        }
        return furthest;
    };
    auto insertHull=[&](Point p1,Point val){
        auto it=find_if(hull.begin(),hull.end(),[&](const Point& pt){return pt.id==p1.id;});
        if(it!=hull.end())hull.insert(it+1,val);
    };
    function<void(Point,Point,const vector<Point>&)> solve=[&](Point p1,Point p2,const vector<Point>& ptsSet){
        if(ptsSet.empty())return;
        Point C=findFurthest(p1,p2,ptsSet);
        insertHull(p1,C);
        recordStep("For segment P"+p1.id+"-P"+p2.id+", found furthest point P"+C.id+". Discarding interior points.",hull,{p1,p2,C},{{p1,p2},{p1,C},{C,p2}});
        vector<Point> leftOfP1C,leftOfCP2;
        for(const auto& p:ptsSet){
            if(p.id==C.id)continue;
            if(getOrientation(p1,C,p)<0)leftOfP1C.push_back(p);
            else if(getOrientation(C,p2,p)<0)leftOfCP2.push_back(p);
            else discarded_points.push_back(p);
        }
        solve(p1,C,leftOfP1C);
        solve(C,p2,leftOfCP2);
    };
    solve(A,B,leftSet);
    solve(B,A,rightSet);
    vector<Line> final_lns;
    for(size_t k=0;k<hull.size()-1;k++)final_lns.push_back({hull[k],hull[k+1]});
    final_lns.push_back({hull.back(),hull[0]});
    recordStep("Convex Hull completed! Total points on hull: "+to_string(hull.size()),hull,{},final_lns);
    return steps;
}
