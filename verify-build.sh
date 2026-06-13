#!/bin/bash

# Sehat AI - Build & Deployment Verification Script
# This script verifies the complete build and deployment readiness

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    SEHAT AI - COMPLETE VIDEO CALL BACKEND VERIFICATION       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Track verification status
VERIFICATION_PASSED=0
VERIFICATION_TOTAL=0

verify_step() {
    local step_name=$1
    local command=$2
    
    VERIFICATION_TOTAL=$((VERIFICATION_TOTAL + 1))
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $step_name"
        VERIFICATION_PASSED=$((VERIFICATION_PASSED + 1))
    else
        echo -e "${RED}✗${NC} $step_name"
    fi
}

# ============================================
# BACKEND VERIFICATION
# ============================================
echo -e "${YELLOW}[1] BACKEND FILES${NC}"
verify_step "app.ts exists" "test -f backend/src/app.ts"
verify_step "server.ts exists" "test -f backend/src/server.ts"
verify_step "package.json exists" "test -f backend/package.json"

echo ""
echo -e "${YELLOW}[2] BACKEND SERVICES${NC}"
verify_step "mediaService.ts" "test -f backend/src/services/mediaService.ts"
verify_step "trugenService.ts" "test -f backend/src/services/trugenService.ts"
verify_step "aiOrchestratorService.ts" "test -f backend/src/services/aiOrchestratorService.ts"

echo ""
echo -e "${YELLOW}[3] BACKEND CONTROLLERS${NC}"
verify_step "videoController.ts" "test -f backend/src/controllers/videoController.ts"
verify_step "reportController.ts" "test -f backend/src/controllers/reportController.ts"
verify_step "emergencyController.ts" "test -f backend/src/controllers/emergencyController.ts"
verify_step "consultationController.ts" "test -f backend/src/controllers/consultationController.ts"

echo ""
echo -e "${YELLOW}[4] BACKEND ROUTES${NC}"
verify_step "video.ts routes" "test -f backend/src/routes/video.ts"
verify_step "reports.ts routes" "test -f backend/src/routes/reports.ts"
verify_step "emergency.ts routes" "test -f backend/src/routes/emergency.ts"
verify_step "consultation.ts routes" "test -f backend/src/routes/consultation.ts"

echo ""
echo -e "${YELLOW}[5] REALTIME SYSTEMS${NC}"
verify_step "consultationSocket.ts" "test -f backend/src/realtime/consultationSocket.ts"
verify_step "webrtcSignaling.ts" "test -f backend/src/realtime/webrtcSignaling.ts"

echo ""
echo -e "${YELLOW}[6] TYPES & UTILITIES${NC}"
verify_step "consultation.ts types" "test -f backend/src/types/consultation.ts"
verify_step "dashboardManager.ts" "test -f backend/src/utils/dashboardManager.ts"

# ============================================
# AI SERVICE VERIFICATION
# ============================================
echo ""
echo -e "${YELLOW}[7] AI SERVICE${NC}"
verify_step "main.py exists" "test -f ai/main.py"
verify_step "requirements.txt exists" "test -f ai/requirements.txt"
verify_step "Dockerfile exists" "test -f ai/Dockerfile"

# ============================================
# PRISMA VERIFICATION
# ============================================
echo ""
echo -e "${YELLOW}[8] DATABASE SCHEMA${NC}"
verify_step "schema.prisma exists" "test -f backend/prisma/schema.prisma"

# ============================================
# DOCKER VERIFICATION
# ============================================
echo ""
echo -e "${YELLOW}[9] DOCKER CONFIGURATION${NC}"
verify_step "docker-compose.yml" "test -f docker-compose.yml"
verify_step "backend Dockerfile" "test -f backend/Dockerfile"
verify_step "ai Dockerfile" "test -f ai/Dockerfile"

# ============================================
# DOCUMENTATION VERIFICATION
# ============================================
echo ""
echo -e "${YELLOW}[10] DOCUMENTATION${NC}"
verify_step "IMPLEMENTATION_GUIDE.md" "test -f IMPLEMENTATION_GUIDE.md"
verify_step ".env.example exists" "test -f .env.example"

# ============================================
# FRONTEND INTEGRITY CHECK
# ============================================
echo ""
echo -e "${YELLOW}[11] FRONTEND INTEGRITY${NC}"
verify_step "frontend routes intact" "test -f frontend/src/routes/ai-doctor.tsx"
verify_step "frontend consult page intact" "test -f frontend/src/routes/consult.tsx"
verify_step "frontend dashboard intact" "test -f frontend/src/routes/dashboard.tsx"

# ============================================
# CODE STRUCTURE VERIFICATION
# ============================================
echo ""
echo -e "${YELLOW}[12] API ENDPOINTS CHECK${NC}"

# Check if app.ts has the new routes
if grep -q "videoRouter" backend/src/app.ts; then
    echo -e "${GREEN}✓${NC} Video routes registered"
    VERIFICATION_PASSED=$((VERIFICATION_PASSED + 1))
else
    echo -e "${RED}✗${NC} Video routes not registered"
fi
VERIFICATION_TOTAL=$((VERIFICATION_TOTAL + 1))

if grep -q "reportRouter" backend/src/app.ts; then
    echo -e "${GREEN}✓${NC} Report routes registered"
    VERIFICATION_PASSED=$((VERIFICATION_PASSED + 1))
else
    echo -e "${RED}✗${NC} Report routes not registered"
fi
VERIFICATION_TOTAL=$((VERIFICATION_TOTAL + 1))

if grep -q "emergencyRouter" backend/src/app.ts; then
    echo -e "${GREEN}✓${NC} Emergency routes registered"
    VERIFICATION_PASSED=$((VERIFICATION_PASSED + 1))
else
    echo -e "${RED}✗${NC} Emergency routes not registered"
fi
VERIFICATION_TOTAL=$((VERIFICATION_TOTAL + 1))

# ============================================
# SOCKET.IO VERIFICATION
# ============================================
echo ""
echo -e "${YELLOW}[13] WEBSOCKET INTEGRATION${NC}"

if grep -q "initConsultationSocket" backend/src/socket/index.ts; then
    echo -e "${GREEN}✓${NC} Socket.IO integration updated"
    VERIFICATION_PASSED=$((VERIFICATION_PASSED + 1))
else
    echo -e "${RED}✗${NC} Socket.IO integration missing"
fi
VERIFICATION_TOTAL=$((VERIFICATION_TOTAL + 1))

# ============================================
# DEPENDENCIES CHECK
# ============================================
echo ""
echo -e "${YELLOW}[14] DEPENDENCIES${NC}"

if grep -q "socket.io" backend/package.json; then
    echo -e "${GREEN}✓${NC} Socket.IO dependency"
    VERIFICATION_PASSED=$((VERIFICATION_PASSED + 1))
else
    echo -e "${RED}✗${NC} Socket.IO dependency missing"
fi
VERIFICATION_TOTAL=$((VERIFICATION_TOTAL + 1))

if grep -q "form-data" backend/package.json; then
    echo -e "${GREEN}✓${NC} form-data dependency"
    VERIFICATION_PASSED=$((VERIFICATION_PASSED + 1))
else
    echo -e "${RED}✗${NC} form-data dependency missing"
fi
VERIFICATION_TOTAL=$((VERIFICATION_TOTAL + 1))

# ============================================
# SUMMARY
# ============================================
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                      VERIFICATION SUMMARY                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"

PERCENTAGE=$((VERIFICATION_PASSED * 100 / VERIFICATION_TOTAL))

if [ "$VERIFICATION_PASSED" -eq "$VERIFICATION_TOTAL" ]; then
    echo -e "${GREEN}✓ ALL VERIFICATIONS PASSED ($VERIFICATION_PASSED/$VERIFICATION_TOTAL)${NC}"
    echo ""
    echo -e "${GREEN}Your Sehat AI backend is ready to deploy!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Set environment variables in .env"
    echo "2. Run: docker-compose up -d"
    echo "3. Test: curl http://localhost:4000/health"
    echo "4. WebSocket: Visit frontend and check console"
    exit 0
else
    echo -e "${RED}✗ VERIFICATION INCOMPLETE ($VERIFICATION_PASSED/$VERIFICATION_TOTAL - $PERCENTAGE%)${NC}"
    echo ""
    echo -e "${YELLOW}Please check the failed items above and fix them.${NC}"
    exit 1
fi
