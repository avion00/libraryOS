from rest_framework.routers import DefaultRouter

from .views import SeatViewSet

router = DefaultRouter()
router.register("", SeatViewSet, basename="seat")

urlpatterns = router.urls
