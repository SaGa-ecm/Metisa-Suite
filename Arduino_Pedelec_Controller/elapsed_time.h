#ifndef APC_ELAPSED_TIME_H
#define APC_ELAPSED_TIME_H

#include <stdint.h>

constexpr bool elapsed_less(uint32_t now, uint32_t previous, uint32_t interval)
{
    return static_cast<uint32_t>(now - previous) < interval;
}

constexpr bool deadline_reached(uint32_t now, uint32_t deadline)
{
    return static_cast<uint32_t>(now - deadline) < 0x80000000UL;
}

constexpr bool deadline_passed(uint32_t now, uint32_t deadline)
{
    return static_cast<uint32_t>(now - deadline) != 0U &&
           static_cast<uint32_t>(now - deadline) < 0x80000000UL;
}

static_assert(!elapsed_less(1000U, 4294966296UL, 50U), "stale pre-wrap events must not remain debounced");
static_assert(elapsed_less(20U, 0xFFFFFFF0UL, 50U), "short intervals crossing millis wrap must remain debounced");
static_assert(!deadline_reached(0xFFFFFFF0UL, 0x00000010UL), "deadline after wrap must not be reached early");
static_assert(deadline_reached(0x00000010UL, 0xFFFFFFF0UL), "deadline crossed during wrap must be reached");
static_assert(!deadline_passed(1000U, 1000U), "strict deadline must not pass at equality");
static_assert(deadline_passed(1001U, 1000U), "strict deadline must pass after equality");

#endif