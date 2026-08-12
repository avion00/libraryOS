from rest_framework.pagination import PageNumberPagination


class ConfigurablePageNumberPagination(PageNumberPagination):
    """Allows ?page_size=N (capped) for UI dropdowns that need the full set
    (e.g. seat pickers), while list views default to a small page."""

    page_size_query_param = "page_size"
    max_page_size = 1000
