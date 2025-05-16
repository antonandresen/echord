# Method, Documentation, and Checklist (MDC) System

## Document Structure

### 1. Project Documentation (`docs/`)
- `ARCHITECTURE.md` - High-level architecture and design principles ✅
- `PROGRESS.md` - Current progress, completed features, and upcoming work
- `STRUCTURE.md` - File-by-file breakdown of the codebase
- `API_COVERAGE.md` - Discord API endpoints coverage tracking
- `COMPONENTS.md` - Detailed component documentation
- `CHECKLIST.md` - Master checklist of all tasks

### 2. Implementation Rules

1. **Before Implementation**
   - Check `STRUCTURE.md` for existing components
   - Review `CHECKLIST.md` for dependencies
   - Update `PROGRESS.md` with planned work

2. **During Implementation**
   - Follow patterns in `ARCHITECTURE.md`
   - Document new files in `STRUCTURE.md`
   - Add tests as specified in `ARCHITECTURE.md`

3. **After Implementation**
   - Update `PROGRESS.md` with completed work
   - Check off items in `CHECKLIST.md`
   - Update `API_COVERAGE.md` if applicable

## File Purposes

### STRUCTURE.md
```markdown
src/
  client/
    Client.ts - Main client class, handles high-level operations ✅
  rest/
    RESTClient.ts - Handles REST API communication ✅
  gateway/
    GatewayClient.ts - WebSocket connection and event handling ✅
  cache/
    CacheManager.ts - Manages entity caching
  types/
    api.ts - Discord API type definitions ✅
    gateway.ts - Gateway-specific types ✅
  structures/
    Base.ts - Base class for all entities
    Guild.ts - Guild structure and methods
    ...
```

### PROGRESS.md
```markdown
## Completed
- [x] REST client implementation
- [x] Gateway client implementation
- [x] Basic type definitions

## In Progress
- [ ] Cache system
- [ ] Entity structures

## Upcoming
- [ ] Voice support
- [ ] Sharding
```

### API_COVERAGE.md
```markdown
## REST Endpoints
- [x] GET /users/@me
- [x] GET /guilds/{guild.id}
...

## Gateway Events
- [x] READY
- [x] MESSAGE_CREATE
...
```

### CHECKLIST.md
```markdown
## Core Infrastructure
- [x] REST Client
  - [x] Rate limiting
  - [x] Error handling
- [x] Gateway Client
  - [x] Connection management
  - [x] Event handling
...
```

## Working Method

1. **Feature Implementation Flow**
   ```mermaid
   graph TD
     A[Check CHECKLIST.md] --> B[Review STRUCTURE.md]
     B --> C[Implement Feature]
     C --> D[Update Documentation]
     D --> E[Mark as Complete]
   ```

2. **Documentation Update Flow**
   ```mermaid
   graph TD
     A[New Feature] --> B[Update STRUCTURE.md]
     B --> C[Update PROGRESS.md]
     C --> D[Update API_COVERAGE.md]
     D --> E[Check CHECKLIST.md]
   ```

## Rules for Assistant

1. **Before Each Response**
   - Review current progress in `PROGRESS.md`
   - Check dependencies in `CHECKLIST.md`
   - Verify file structure in `STRUCTURE.md`

2. **During Implementation**
   - Follow patterns established in `ARCHITECTURE.md`
   - Keep documentation up-to-date
   - Add necessary tests

3. **After Implementation**
   - Update all relevant documentation
   - Mark completed items
   - Plan next steps

## Current Status

### Implemented Components
- REST Client ✅
- Gateway Client ✅
- Basic Types ✅

### Next Steps
1. Create Cache System
2. Implement Entity Structures
3. Add Voice Support

## Documentation Maintenance

- Update documentation with each feature
- Keep checklists current
- Track API coverage
- Document design decisions

## Best Practices

1. **Code Organization**
   - Follow established patterns
   - Keep files focused
   - Document public APIs

2. **Testing**
   - Write tests alongside features
   - Cover edge cases
   - Document test scenarios

3. **Documentation**
   - Keep docs in sync with code
   - Update progress regularly
   - Document design decisions 